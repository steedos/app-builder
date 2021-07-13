
import React, { useContext, useEffect, useState } from "react";
import * as PropTypes from 'prop-types';
import { forEach, defaults, groupBy, filter, map, defaultsDeep, isObject, isBoolean, clone, isNil, compact, uniq} from 'lodash';
import { useQuery } from 'react-query'
// import { FooterToolbar } from '@ant-design/pro-layout';
import { Form } from '@steedos/builder-form';
import { Form as ProForm } from 'antd';
import { BaseFormProps } from "@ant-design/pro-form/es/BaseForm";
import { ModalFormProps } from "@ant-design/pro-form";
import { observer } from "mobx-react-lite"
import stores, { Objects, Forms, API, Settings } from '@steedos/builder-store';
import { Spin } from 'antd';
import moment from 'moment';
import { ObjectFormSections } from './ObjectFormSections';
import { message } from 'antd';
import { translate, BASE_FIELDNAMES_FOR_PERMISSIONS } from '@steedos/builder-sdk';

import './ObjectForm.less'

export type FormProps<T = Record<string, any>>  = {
  mode?: 'read' | 'edit',
  editable?: boolean,
} & BaseFormProps & ModalFormProps

/*
  fields: 字段定义数组，格式同YML
*/
export type ObjectFormProps = {
  objectApiName?: string,
  fields?: [string],
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
  form?: any
  // showFooterToolbar?: boolean
} & FormProps

export const ObjectForm = observer((props:ObjectFormProps) => {
  const {
    objectApiName, // = Settings.currentObjectApiName,
    fields = [],//只显示指定字段
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
    onValuesChange: defaultOnValuesChange,
    ...rest
  } = props;
  const [proForm] = ProForm.useForm();
  const currentForm = rest.form || proForm;
  const [undefinedValues, setUndefinedValues] = useState({});

  const defaultValues = clone(initialValues);
  const sectionsRef = React.createRef();
  const form = Forms.loadById(formId)
  form.setMode(mode);

  // const [fieldSchemas, setFieldSchemas] = useState([]);
  // const [fieldNames, setFieldNames] = useState([]);
  const fieldNames = [];
  const fieldSchemaArray = [];

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
    // // 新建记录时，把autonumber、formula、summary类型字段视为omit字段不显示
    // let isOmitField = isModalForm && ["autonumber", "formula", "summary"].indexOf(field.type) > -1;
    let isValid = !fields || !fields.length || fields.indexOf(fieldName) > -1
    // if (!field.hidden && !isObjectField && !isOmitField && isValid){
    // 这里不可以直接把hidden的字段排除，因为hidden的字段需要加载但不显示，见：表单字段omit,hidden规则变更 #138
    if (!isObjectField && isValid){
      fieldSchemaArray.push(defaults({name: fieldName}, field))
    }
  })
  forEach(fieldSchemaArray, (field:any)=>{
    fieldNames.push(field.name)
  })
  let record: any;
  if (object && recordId) {
    const fieldsForFetch = uniq(compact(fieldNames.concat(BASE_FIELDNAMES_FOR_PERMISSIONS)));
    const recordCache = object.getRecord(recordId, fieldsForFetch)
    if (recordCache.isLoading)
      return (<div><Spin/></div>)

    if(recordCache.data && recordCache.data.value && recordCache.data.value.length > 0){
      record = recordCache.data.value[0];
      forEach(fieldNames, (fieldName:any)=>{
        let filedValue = record[fieldName];
        // 字段值为null等也传过去, null表示往数据库存空值。
        if (filedValue !== undefined ){
          defaultValues[fieldName] = filedValue;
        }
      })
    } else {
    }
  }

  const conversionSubmitValue = (values:any) => {
    const fields = mergedSchema.fields;
    let extendValues = {};
    forEach(values,(value,key)=>{
      if(fields[key].type === 'date'){
        // 日期字段设置为utc0点
        extendValues[key] = moment(value);
        extendValues[key].utcOffset(0);
        extendValues[key].hour(0);
        extendValues[key].minute(0);
        extendValues[key].second(0);
        extendValues[key].millisecond(0);
      }
    });
    return Object.assign({}, values, extendValues);
  }
  const onFinish = async(values:any) =>{
    if (!object) 
      return
    
    let result; 
    let convertedValues = conversionSubmitValue(values);
    if(!recordId){
      try {
        result = await API.insertRecord(objectApiName, Object.assign({},undefinedValues,convertedValues));
        if(afterInsert){
          return afterInsert(result);
        }else{
          return result ? true : false
        }
      } catch (error) {
        message.error(translate(error.message));
      }
      
    }else{
      try {
        result = await API.updateRecord(objectApiName, recordId, Object.assign({},undefinedValues,convertedValues));
        object.getRecord(recordId, fieldNames).loadRecord();
        if(afterUpdate){
          return afterUpdate(result);  
        }else{
          return result ? true : false
        }
      } catch (error) {
        message.error(translate(error.message));
      }
    } 
  }

  const getFieldsByDependOn = (fieldName: string) =>{
    const result = {};
    forEach(mergedSchema.fields,(fieldItem,fieldKey)=>{
      if(fieldItem.depend_on && fieldItem.depend_on.indexOf(fieldName) > -1){
        result[fieldKey] = fieldItem;
      }
    })
    return result;
  }

  const onValuesChange = async (changedValues, values)=>{

    forEach(changedValues,(value,key)=>{
      const dependOnFields = getFieldsByDependOn(key);
      let fieldsForClear = {};
      forEach(dependOnFields,(fieldItem:any,fieldKey)=>{
        fieldsForClear[fieldKey] = fieldItem.multiple ? [] : null;
      });
      currentForm.setFieldsValue(fieldsForClear);
    })

    forEach(changedValues,(value,key)=>{
      // value = undefined || null 都要保存null 到数据库中。
      if(isNil(value)){
        undefinedValues[key] = null;
        setUndefinedValues(undefinedValues)
      }
    });
    const args = {
      changedValues,
      values,
      form: currentForm
    }
    try{
      let valuesChangeFun = defaultOnValuesChange;
      if(!valuesChangeFun){
        valuesChangeFun = mergedSchema?.form?.onValuesChange
      }
      await valuesChangeFun?.call({}, args);
    }
    catch(ex){
      console.error(ex);
    }
    (sectionsRef.current as any)?.reCalcSchema(changedValues, values)
  }

  // 从详细页面第一次进入另一个相关详细页面是正常，第二次initialValues={initialValues} 这个属性不生效。
  // 所以在此调用下 form.setFieldsValue() 使其重新生效。
  currentForm.setFieldsValue(defaultValues);

  // 识别字段级权限
  forEach(mergedSchema.fields, (field, fieldName) => {
    if(!field.readonly){
      // 字段未配置readonly时，按权限取值
      field.readonly = !API.client.field.isEditable(objectApiName, field, record)
    }
  });
  return (
    <Form 
      // formFieldComponent = {ObjectField}
      name={formId}
      className='builder-form object-form'
      initialValues={defaultValues}
      mode={mode}
      form={currentForm}
      layout={layout}
      submitter={submitter}
      isModalForm={isModalForm}
      isDrawerForm={isDrawerForm}
      trigger={trigger}
      onFinish={async (values)=>{
        setTimeout(async ()=>{
          // console.log(`values`, JSON.stringify(values), JSON.stringify(currentForm.getFieldsValue(false)))
          await onFinish(currentForm.getFieldsValue(false))
        }, 150)
      }}
      // omitNil={false}
      onValuesChange={onValuesChange}
      visible={visible}
      dateFormatter={false}
      onKeyPress={(e) => {
        if (e.key === "Enter") e.stopPropagation();
      }}
      {...rest}
    >
      {children}
      <ObjectFormSections form={currentForm} onRef={sectionsRef} formData={defaultValues}  objectApiName={objectApiName} fields={fields as any} objectSchema={mergedSchema} recordId={recordId} formId={formId} isModalForm={isModalForm}></ObjectFormSections>
    </Form>
  )
});



ObjectForm['propTypes'] = {
  objectApiName: PropTypes.string,
  mode: PropTypes.string,
};