
import React, { useContext, useEffect, useState } from "react";
import * as PropTypes from 'prop-types';
import { forEach, defaults, groupBy, filter, map, defaultsDeep, isObject, isBoolean} from 'lodash';
import { useQuery } from 'react-query'
// import { FooterToolbar } from '@ant-design/pro-layout';
import { Form } from '@steedos/builder-form';
import { Form as ProForm } from 'antd';
import { BaseFormProps } from "@ant-design/pro-form/es/BaseForm";
import { ModalFormProps } from "@ant-design/pro-form";
import type { ProFieldFCMode } from '@ant-design/pro-utils';
import { ObjectField } from "./ObjectField";
import { observer } from "mobx-react-lite"
import stores, { Objects, Forms, API, Settings } from '@steedos/builder-store';
import { FieldSection } from "@steedos/builder-form";
import { Spin } from 'antd';
import { clone } from 'lodash';

import './ObjectForm.less'

export type FormProps<T = Record<string, any>>  = {
  mode?: 'read' | 'edit',
  editable?: boolean,
} & BaseFormProps & ModalFormProps

/*
  fields: 字段定义数组，格式同YML
*/
export type ObjectFormProps = {
  objectApiName?: string,
  objectSchema?: any,
  initialValues?: any,
  recordId?: string
  submitter?: any,
  isModalForm?: boolean,
  isDrawerForm?: boolean,
  trigger?: any
  afterUpdate?: Function,
  afterInsert?: Function,
  visible?: boolean,
  layout?: string,
  // showFooterToolbar?: boolean
} & FormProps

export const ObjectForm = observer((props:ObjectFormProps) => {
  const {
    objectApiName, // = Settings.currentObjectApiName,
    initialValues = {},
    objectSchema = {}, // 和对象定义中的fields格式相同，merge之后 render。
    recordId, // = Settings.currentRecordId,
    name: formId = 'default',
    mode = 'edit', 
    layout = 'vertical',
    children,
    submitter,
    // showFooterToolbar,
    isModalForm,
    isDrawerForm,
    afterUpdate,
    afterInsert,
    trigger,
    visible,
    ...rest
  } = props;
  const [proForm] = ProForm.useForm();

  const defaultValues = clone(initialValues);
 
  const form = Forms.loadById(formId)
  form.setMode(mode);

  // const [fieldSchemas, setFieldSchemas] = useState([]);
  // const [fieldNames, setFieldNames] = useState([]);
  const fieldNames = [];
  const fieldSchemaArray = [];
  const sections = [];

  const object = objectApiName? Objects.getObject(objectApiName): null;
  if (object && object.isLoading) return (<div><Spin/></div>)

  
  const mergedSchema = object? defaultsDeep({}, object.schema, objectSchema): objectSchema;
  fieldSchemaArray.length = 0
  forEach(mergedSchema.fields, (field, fieldName) => {
    if (!field.group || field.group == 'null' || field.group == '-')
      field.group = '通用'
    let isObjectField = /\w+\.\w+/.test(fieldName)
    if (field.type == 'grid' || field.type == 'object') {
      // field.group = field.label
      field.is_wide = true;
    }
    // 新建记录时，把autonumber、formula、summary类型字段视为omit字段不显示
    let isOmitField = isModalForm && ["autonumber", "formula", "summary"].indexOf(field.type) > -1
    if (!field.hidden && !isObjectField && !isOmitField){
      fieldSchemaArray.push(defaults({name: fieldName}, field))
    }
  })
  forEach(fieldSchemaArray, (field:any)=>{
    fieldNames.push(field.name)
  })

  if (object && recordId) {
    const recordCache = object.getRecord(recordId, fieldNames)
    if (recordCache.isLoading)
      return (<div><Spin/></div>)

    if(recordCache.data && recordCache.data.value && recordCache.data.value.length > 0){
      const record = recordCache.data.value[0];
      forEach(fieldNames, (fieldName:any)=>{
        if (record[fieldName])
          defaultValues[fieldName] = record[fieldName];
      })
    } else {
    }
  }
  


  const onFinish = async(values:any) =>{
    if (!object) 
      return
    
    let result; 
    if(!recordId){     
      result = await API.insertRecord(objectApiName, values);
      if(afterInsert){
        return afterInsert(result);
      }else{
        return result ? true : false
      }
    }else{
      result = await API.updateRecord(objectApiName, recordId, values);
      object.getRecord(recordId, fieldNames).loadRecord();
      if(afterUpdate){
        return afterUpdate(result);  
      }else{
        return result ? true : false
      }
    } 
  }

  const getSection = (sectionName, options) => {
    const sectionFields = filter(fieldSchemaArray, { 'group': sectionName });
    const columns = isModalForm ? 2 : undefined
    return (
      <FieldSection title={sectionName} key={sectionName} columns={columns} {...options}>
        {map(sectionFields, (field:any)=>{
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
     const sections = groupBy(fieldSchemaArray, 'group');
     const dom = [];
     const options = (Object.keys(sections).length == 1)?{titleHidden: true}: {}
     forEach(sections, (value, key) => {
      dom.push(getSection(key, options))
    })
    return dom;
  }

  // if(isObject(submitter) && showFooterToolbar){
  //   (submitter as any).render = (_, dom) => <FooterToolbar style={{height: "64px", lineHeight:"64px"}}>{dom}</FooterToolbar>
  // }


  // 从详细页面第一次进入另一个相关详细页面是正常，第二次initialValues={initialValues} 这个属性不生效。
  // 所以在此调用下 form.setFieldsValue() 使其重新生效。
  proForm.setFieldsValue(defaultValues)
  return (
    <Form 
      // formFieldComponent = {ObjectField}
      name={formId}
      className='builder-form object-form'
      initialValues={defaultValues}
      mode={mode}
      form={proForm}
      layout={layout}
      submitter={submitter}
      isModalForm={isModalForm}
      isDrawerForm={isDrawerForm}
      trigger={trigger}
      onFinish={onFinish}
      visible={visible}
      {...rest}
    >
      {children}
      {getSections()}
    </Form>
  )
});



ObjectForm['propTypes'] = {
  objectApiName: PropTypes.string,
  mode: PropTypes.string,
};