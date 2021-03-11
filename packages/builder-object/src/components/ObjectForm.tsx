
import React, { useContext } from "react";
import _ from 'lodash';
import { BuilderStoreContext } from '@builder.io/react';
import { ObjectContext } from "../";
import { useQuery } from "react-query";

import ProForm from '@ant-design/pro-form';
import { BaseFormProps } from "@ant-design/pro-form/lib/BaseForm";
import type { ProFieldFCMode } from '@ant-design/pro-utils';
import { registerObjectFieldComponent } from "..";

export type FormProps<T = Record<string, any>>  = {
  mode?: ProFieldFCMode,
  editable?: boolean,
} & BaseFormProps

export type ObjectFormProps = {
  objectApiName?: string,
  recordId?: string,
} & FormProps

export function ObjectForm(props:ObjectFormProps) {
  const store = useContext(BuilderStoreContext);
  console.log("=ObjectForm===store===", store);
  const objectContext = useContext(ObjectContext);
  let { currentObjectApiName, currentRecordId } = store.context;
  if(!currentObjectApiName){
    currentObjectApiName = objectContext.currentObjectApiName;
  }
  if(!currentRecordId){
    currentRecordId = objectContext.currentRecordId;
  }

  const { mode, editable,  ...rest} = props
  const objectApiName = props.objectApiName ? props.objectApiName : currentObjectApiName as string;
  const recordId = props.recordId ? props.recordId : currentRecordId;
  console.log("=ObjectForm===objectApiName, recordId===", objectApiName, recordId);
  const { 
    isLoading, 
    error, 
    data, 
    isFetching 
  } = useQuery(objectApiName, async () => {
    return await objectContext.requestObject(objectApiName as string);
  });
  const objectSchema:any = data
  console.log("==requestObject==data===", data);

  if (!objectSchema) 
    return (<div>Object Loading...</div>)

  registerObjectFieldComponent(_.keys(objectSchema.fields));
  
  //TODO  fields['name', 'type']不为空
  
  // const fields:any = []
  // _.forEach(objectSchema.fields, (field, fieldName)=>{
  //   if(!field.hidden)
  //     fields.push(field)
  // })
  // const formProps = {
  //   fields: fields
  // }

  const initialValues = {} // 根据 recordId 抓数据，生成。
  return (
    <ProForm 
      // formFieldComponent = {ObjectField}
      {...rest}
    />
  )
}