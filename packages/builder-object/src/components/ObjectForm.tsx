
import React, { useContext } from "react";
import _ from 'lodash';
// import { BuilderStoreContext } from '@builder.io/react';
import { ObjectContext } from "../";
import { useQueries } from 'react-query'

import { Form } from '@steedos/builder-form/src/index';
import { BaseFormProps } from "@ant-design/pro-form/lib/BaseForm";
import type { ProFieldFCMode } from '@ant-design/pro-utils';
import { registerObjectFieldComponent } from "..";
import { observer } from "mobx-react-lite"
import { FormModel, store } from '@steedos/builder-store';

export type FormProps<T = Record<string, any>>  = {
  mode?: ProFieldFCMode,
  editable?: boolean,
} & BaseFormProps

export type ObjectFormProps = {
  objectApiName?: string,
  recordId?: string,
  builderState?: any
} & FormProps

export const ObjectForm = observer((props:ObjectFormProps) => {
  let objectFormMode = props.builderState.state.formMode;
  if(objectFormMode === 'add'){
    objectFormMode = 'edit';
  }

  const {
    name: formId = 'default',
    mode= objectFormMode, 
    layout = 'vertical',
    ...rest
  } = props;
 
  if (!store.forms[formId])
    store.forms[formId] = FormModel.create({id: formId, mode});
  const objectContext = useContext(ObjectContext);
  let { currentObjectApiName, currentRecordId } = store;
  if(!currentObjectApiName){
    currentObjectApiName = objectContext.currentObjectApiName;
  }
  if(!currentRecordId){
    currentRecordId = objectContext.currentRecordId;
  }

  const objectApiName = props.objectApiName ? props.objectApiName : currentObjectApiName as string;
  const recordId = props.recordId ? props.recordId : currentRecordId || '';

  //TODO fields的确定
  const filter = ['_id', '=', recordId];
  const fields = ['name', 'type', 'number_of_employees', 
                  'description', 'email', 'industry', 
                  'rating', 'salutation', 'startdate__c', 
                  'datetime__c','state', 'summary__c', 
                  'website', 'annual_revenue', 'fn__c'];
  const results = useQueries([
    { queryKey: objectApiName, queryFn: async () => {
        return await objectContext.requestObject(objectApiName as string);
      }
    },
    { queryKey: [objectApiName, filter, fields] , queryFn: async () => {
      return await objectContext.requestRecords(objectApiName, filter, fields);
      } 
    }
  ])
  const { 
    isLoading: isLoadingObject, 
    error: errorObject, 
    data: data1, 
    isFetching: isFetchingObject
  } = results[0];
  const { 
    isLoading: isLoadingRecord, 
    error: errorRecord, 
    data: data2, 
    isFetching: isFetchingRecord
  } = results[1];

  const isLoadings = isLoadingObject || isLoadingRecord;

  if (isLoadings) return (<div>Object Loading...</div>)

  const object:any = data1;
  const records:any = data2;

  registerObjectFieldComponent(_.keys(object.fields));
  
  let initialValues = {};
  if(records.length > 0){
    const record = records[0];
    fields.map((fieldName)=>{
      initialValues[fieldName] = record[fieldName];
    })
  }
  const onFinish = async(values:any) =>{
    let result;
    if(recordId){
      result = await objectContext.updateRecord(objectApiName, recordId, values);
      if(result){
        alert("表单修改成功！");
      }
    }else{
      result = await objectContext.insertRecord(objectApiName, values);
      if(result){
        alert("添加成功！");
      }
    }   
    console.log('----onFinish--result--', result);  
  }
  return (
    <Form 
      // formFieldComponent = {ObjectField}
      initialValues={initialValues}
      mode={mode}
      layout={layout}
      onFinish={onFinish}
      {...rest}
    />
  )
});