
import React, { useContext, useEffect, useState } from "react";
import * as PropTypes from 'prop-types';
import _ from 'lodash';
// import { BuilderStoreContext } from '@builder.io/react';
import { useQuery } from 'react-query'

import { Form } from '@steedos/builder-form';
import { BaseFormProps } from "@ant-design/pro-form/lib/BaseForm";
import type { ProFieldFCMode } from '@ant-design/pro-utils';
import { ObjectField } from "./ObjectField";
import { observer } from "mobx-react-lite"
import { FormModel, Objects, Forms, API } from '@steedos/builder-store';
import { FieldSection } from "@steedos/builder-form";

import './ObjectForm.less'

export type FormProps<T = Record<string, any>>  = {
  mode?: 'read' | 'edit',
  editable?: boolean,
} & BaseFormProps

/*
  fields: 字段定义数组，格式同YML
*/
export type ObjectFormProps = {
  objectApiName: string,
  objectSchema?: any,
  initialValues?: any,
  recordId?: string
} & FormProps

export const ObjectForm = observer((props:ObjectFormProps) => {
  const {
    objectApiName,
    initialValues = {},
    objectSchema = {}, // 和对象定义中的fields格式相同，merge之后 render。
    recordId = '',
    name: formId = 'default',
    mode = 'edit', 
    layout = 'vertical',
    children,
    ...rest
  } = props;
 
  const form = Forms.loadById(formId)
  form.setMode(mode);

  // const [fieldSchemas, setFieldSchemas] = useState([]);
  // const [fieldNames, setFieldNames] = useState([]);
  const fieldNames = [];
  const fieldSchemaArray = [];

  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div>Loading object ...</div>)

  if (object.schema) {
    const mergedSchema = _.defaultsDeep({}, object.schema, objectSchema);
    fieldSchemaArray.length = 0
    _.mapKeys(mergedSchema.fields, (field, fieldName) => {
      let isObjectField = /\w+\.\w+/.test(fieldName)
      if (!field.hidden && !isObjectField)
      fieldSchemaArray.push(_.defaults({name: fieldName}, field, {group: 'General'}))
    })
    _.forEach(fieldSchemaArray, (field:any)=>{
      fieldNames.push(field.name)
    })
  
    const recordCache = object.getRecord(recordId, fieldNames)
    if (recordCache.isLoading)
      return (<div>Loading record ...</div>)

    if(recordCache.data && recordCache.data.value && recordCache.data.value.length > 0){
      const record = recordCache.data.value[0];
      _.forEach(fieldNames, (fieldName:any)=>{
        if (record[fieldName])
          initialValues[fieldName] = record[fieldName];
      })
    } else {
    }
  }
  


  const onFinish = async(values:any) =>{
    let result; 
    if(!recordId){     
      result = await API.insertRecord(objectApiName, values);
      if(result){
        alert("添加成功！");
      }
    }else{
        
      result = await API.updateRecord(objectApiName, recordId, values);
      if(result){
        alert("表单修改成功！");
      }  
    } 
  }

  const getSection = (sectionName) => {
    const sectionFields = _.filter(fieldSchemaArray, { 'group': sectionName });
    return (
      <FieldSection title={sectionName} key={sectionName}>
        {_.map(sectionFields, (field:any)=>{
          const fieldProps = {
            key: field.name,
            name: field.name,
            objectApiName,
            fieldName: field.name,
            label: field.label,
            fieldSchema: field,
            mode,
          };
          return (<ObjectField {...fieldProps} />)
        })}
      </FieldSection>
    )
  }

  const getSections = () => {
     const sections = _.groupBy(fieldSchemaArray, 'group');
     const dom = [];
     _.forEach(sections, (value, key) => {
      dom.push(getSection(key))
    })
    return dom;
  }

  return (
    <Form 
      // formFieldComponent = {ObjectField}
      className='builder-form object-form'
      initialValues={initialValues}
      mode={mode}
      layout={layout}
      onFinish={onFinish}
      {...rest}
    >
      {children}
      {getSections()}
    </Form>
  )
});



Form['propTypes'] = {
  objectApiName: PropTypes.string,
};