
import React, { useContext, useEffect, useState } from "react";
import * as PropTypes from 'prop-types';
import { forEach, defaults, groupBy, filter, map, defaultsDeep, isObject, isBoolean, clone, isNil} from 'lodash';
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
    // 新建记录时，把autonumber、formula、summary类型字段视为omit字段不显示
    let isOmitField = isModalForm && ["autonumber", "formula", "summary"].indexOf(field.type) > -1;
    let isValid = !fields || !fields.length || fields.indexOf(fieldName) > -1
    if (!field.hidden && !isObjectField && !isOmitField && isValid){
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
      result = await API.insertRecord(objectApiName, convertedValues);
      if(afterInsert){
        return afterInsert(result);
      }else{
        return result ? true : false
      }
    }else{
      result = await API.updateRecord(objectApiName, recordId, Object.assign({},undefinedValues,convertedValues));
      object.getRecord(recordId, fieldNames).loadRecord();
      if(afterUpdate){
        return afterUpdate(result);  
      }else{
        return result ? true : false
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
      ((rest.form || proForm) as any).setFieldsValue(fieldsForClear);
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
      form: rest.form || proForm
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
  ((rest.form || proForm) as any).setFieldsValue(defaultValues);

  // 识别字段级权限
  forEach(mergedSchema.fields, (field, fieldName) => {
    if(!field.readonly){
      // 字段未配置readonly时，按权限取值
      field.readonly = !API.client.field.isEditable(objectApiName, field, defaultValues)
    }
  });
  return (
    <Form 
      // formFieldComponent = {ObjectField}
      name={formId}
      className='builder-form object-form'
      initialValues={defaultValues}
      mode={mode}
      form={rest.form || proForm}
      layout={layout}
      submitter={submitter}
      isModalForm={isModalForm}
      isDrawerForm={isDrawerForm}
      trigger={trigger}
      onFinish={onFinish}
      // omitNil={false}
      onValuesChange={onValuesChange}
      visible={visible}
      dateFormatter={false}
      {...rest}
    >
      {children}
      <ObjectFormSections form={rest.form || proForm} onRef={sectionsRef} formData={defaultValues}  objectApiName={objectApiName} fields={fields as any} objectSchema={mergedSchema} recordId={recordId} mode = {mode} isModalForm={isModalForm}></ObjectFormSections>
    </Form>
  )
});



ObjectForm['propTypes'] = {
  objectApiName: PropTypes.string,
  mode: PropTypes.string,
};