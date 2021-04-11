
import React, { useContext, useEffect, useState } from "react";
import * as PropTypes from 'prop-types';
import _ from 'lodash';
// import { BuilderStoreContext } from '@builder.io/react';
import { ObjectContext } from "../";
import { useQuery } from 'react-query'

import { Form } from '@steedos/builder-form';
import { BaseFormProps } from "@ant-design/pro-form/lib/BaseForm";
import type { ProFieldFCMode } from '@ant-design/pro-utils';
import { ObjectField } from "./ObjectField";
import { observer } from "mobx-react-lite"
import { FormModel, useStore, Objects } from '@steedos/builder-store';
import { FieldSection } from "@steedos/builder-form";

import './ObjectForm.less'

export type ObjectFormFieldMode = 'add' | ProFieldFCMode;

export type FormProps<T = Record<string, any>>  = {
  mode?: ObjectFormFieldMode,
  editable?: boolean,
} & BaseFormProps

/*
  fields: 字段定义数组，格式同YML
*/
export type ObjectFormProps = {
  objectApiName: string,
  fields?: any,
  initialValues?: any,
  recordId?: string
} & FormProps

export const ObjectForm = observer((props:ObjectFormProps) => {
  const {
    objectApiName,
    initialValues = {},
    fields = {}, // 和对象定义中的fields格式相同，merge之后 render。
    recordId = '',
    name: formId = 'default',
    mode = 'edit', 
    layout = 'vertical',
    children,
    ...rest
  } = props;
 
  const store = useStore();
  const objectContext = useContext(ObjectContext);
  // const [fieldSchemas, setFieldSchemas] = useState([]);
  // const [fieldNames, setFieldNames] = useState([]);
  const fieldNames = [];
  const fieldSchemas = [];

  if (!store.forms[formId])
    store.forms[formId] = FormModel.create({id: formId, mode});
  
  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div>Loading object ...</div>)

  if (object.schema) {
    fieldSchemas.length = 0
    const mergedFields = _.defaultsDeep({}, object.schema.fields, fields);
    _.mapKeys(mergedFields, (field, fieldName) => {
      let isObjectField = /\w+\.\w+/.test(fieldName)
      if (!field.hidden && !isObjectField)
        fieldSchemas.push(_.defaults({name: fieldName}, field, {group: 'General'}))
    })
    _.forEach(fieldSchemas, (field:any)=>{
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
    if(mode === 'add'){     
      result = await objectContext.insertRecord(objectApiName, values);
      if(result){
        alert("添加成功！");
      }
    }else{
      if(!recordId){
        return;
      }
        
      result = await objectContext.updateRecord(objectApiName, recordId, values);
      if(result){
        alert("表单修改成功！");
      }  
    } 
  }

  const getSection = (sectionName) => {
    const fieldMode = mode === "add" ? "edit" : mode;
    const sectionFields = _.filter(fieldSchemas, { 'group': sectionName });
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
            mode: fieldMode,
          };
          return (<ObjectField {...fieldProps} />)
        })}
      </FieldSection>
    )
  }

  const getSections = () => {
     const sections = _.groupBy(fieldSchemas, 'group');
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