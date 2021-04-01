import React, { useContext } from "react";
// import { BuilderStoreContext } from '@builder.io/react';

import { Field } from '@steedos/builder-form/src/index'
import _ from 'lodash';
import { useQuery } from "react-query";
import { ObjectContext } from "../";
import { observer } from "mobx-react-lite"
import { FormContext } from "antd/es/form/context";
import { FormModel, useMst } from '@steedos/builder-store/src';

export type ObjectFieldProps = {
  objectApiName?: string,
  fieldName: string,
  fieldSchema: any,
  required: boolean,
  readonly: boolean,
}

export const getFormFieldProps = (formFieldProps: any, fieldSchema: any, readonly: boolean) => {
  const fieldType = fieldSchema.type;
  // console.log("field===================",field);
  
  switch (fieldType) {

    case 'datetime':
      formFieldProps.valueType = 'dateTime';
      formFieldProps.readonly = readonly;
      break;

    case 'boolean':
      formFieldProps.valueType = 'switch';
      formFieldProps.readonly = readonly;
      break;

    case 'number':
      formFieldProps.valueType = 'digit';
      formFieldProps.readonly = readonly;
      break;

    case 'currency':
      formFieldProps.valueType = 'money';
      formFieldProps.readonly = readonly;
      break;
    case 'autonumber':
      formFieldProps.valueType = 'index';
      formFieldProps.readonly = readonly;
      break;
    case 'url':
      formFieldProps.valueType = 'href';
      break;
    case 'lookup':
      // return (
      //   <div>{`未实现字段类型${fieldType}的组件`}</div>
      // )
      formFieldProps.valueType = 'lookup';
      formFieldProps.readonly = false;
      formFieldProps.referenceTo = fieldSchema.reference_to;
      break;
    case 'master_detail':
      return (
        <div>{`未实现字段类型${fieldType}的组件`}</div>
      )
  }
    // console.log('啊实打实打算+++++++',formFieldProps);
    
  return formFieldProps;
}

export const ObjectField = observer((props: any) => {
  const store = useMst();
  const objectContext = useContext(ObjectContext);
  const context = useContext(FormContext);
  const formId = context.name?context.name:'default';
  const { fieldName, fieldSchema, required, readonly } = props
  let objectApiName = props.objectApiName;
  
  /*
    fieldSchema 如果不存在，应该从对象中获取，但是对象应该从 store 中获取，而不是请求。
  */
 
  // const {
  //   isLoading,
  //   error,
  //   data,
  //   isFetching
  // } = useQuery(objectApiName, async () => {
  //   return await objectContext.requestObject(objectApiName);
  // });
  // if (!objectApiName || !fieldName)
  //   return (<div>请输入对象名和字段名</div>)

  // const objectSchema: any = data

  // if (!objectSchema)
  //   return (<div>Field Loading...</div>)

  // //TODO  fields['name', 'type']不为空

  // const field: any = _.find(objectSchema.fields, (field, key) => {
  //   return fieldName === key;
  // })

  // if (!field) {
  //   return (<div>{`对象${objectApiName}上未定义字段${fieldName}`}</div>)
  // }
  
  // 从对象定义中生成字段信息。
  const fieldType: string = fieldSchema.type;//根据objectApiName及fieldName算出type值
  let objectFieldMode = store.forms[formId].mode;
  let formFieldProps: any = {
    name: fieldName,
    mode: objectFieldMode,
    label: fieldSchema.label,
    placeholder: fieldSchema.help,
    hidden: fieldSchema.hidden,
    valueType: fieldType,
    required: fieldSchema.required,
    options: fieldSchema.options,
    readonly: fieldSchema.readonly,
  }

  if (formFieldProps.mode == "edit") {

    if (fieldSchema.omit) {
      formFieldProps.hidden = true
    }
  } else if (formFieldProps.mode == "read") {
    if (fieldSchema.omit) {
      formFieldProps.readonly = true
    }
  }

  // let fieldProps = {

  // };
  if (fieldType === 'formula') {

    let fieldProps = {
      fieldType: fieldSchema.data_type, 
      readonl: true
    };
    // formFieldProps = getFormFieldProps(formFieldProps, field.data_type, true);
    formFieldProps = getFormFieldProps(formFieldProps, Object.assign({}, fieldSchema, {type:fieldSchema.data_type}), true);

  } else if (fieldType === 'summary') {

    formFieldProps = getFormFieldProps(formFieldProps, fieldSchema.summary_type, true);

  } else {
    formFieldProps = getFormFieldProps(formFieldProps, fieldSchema, formFieldProps.readonly);
  }

  if (formFieldProps.required) {
    formFieldProps.rules = [
      {
        required: true,
        message: `请输入${formFieldProps.label}...`,
      },
    ]
  }
// console.log("formFieldProps===============",formFieldProps);

  // 默认取ProFormText组件
  return (
    <Field
      {...formFieldProps}
    />
  )
  // if (fieldType === 'lookup') {
  //   return (
  //     <div></div>
  //     // <ObjectFieldLookup
  //     //   {...rest}
  //     //   label={props.label}
  //     //   name={fieldName}
  //     //   referenceTo={reference_to}
  //     //   enableAdd={true}
  //     //   placeholder={`请搜索${props.label}...`}
  //     //   readonly={readonly}
  //     // />
  //   )
  // } else {
  //   return (
  //     <ProField
  //       {...formFieldProps}
  //     />
  //   )
  // }
});