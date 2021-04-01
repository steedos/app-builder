
import React, { useContext, useEffect } from "react";
import _ from 'lodash';
// import { BuilderStoreContext } from '@builder.io/react';
import { ObjectContext } from "../";
import { useQuery } from 'react-query'

import { Form } from '@steedos/builder-form';
import { BaseFormProps } from "@ant-design/pro-form/lib/BaseForm";
import type { ProFieldFCMode } from '@ant-design/pro-utils';
import { ObjectField } from "./ObjectField";
import { observer } from "mobx-react-lite"
import { FormModel, useMst } from '@steedos/builder-store';

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
  fields?: any[],
  initialValues?: any,
  recordId?: string
} & FormProps

export const ObjectForm = observer((props:ObjectFormProps) => {
  const store = useMst();

  const {
    objectApiName,
    initialValues = {},
    fields = [],
    recordId = '',
    name: formId = 'default',
    mode = 'edit', 
    layout = 'vertical',
    ...rest
  } = props;
 
  if (!store.forms[formId])
    store.forms[formId] = FormModel.create({id: formId, mode});
  
  const objectContext = useContext(ObjectContext);

  const { 
    isLoading: isLoadingObject, 
    error: errorObject, 
    data: objectSchema, 
    isFetching: isFetchingObject
  } = useQuery<any>({ queryKey: objectApiName, queryFn: async () => {
    return await objectContext.requestObject(objectApiName as string);
  }});
  // if (isLoadingObject) return (<div>Loading object ...</div>)

  useEffect(() => {
    if (!objectSchema) return;
    if (fields.length == 0) {
      _.mapKeys(objectSchema.fields, (field, fieldName) => {
        if (!field.hidden)
          fields.push(_.defaults({name: fieldName}, [field]))
      })
    }
  }, [objectSchema]);

  const fieldNames = []
  _.forEach(fields, (field:any)=>{
    fieldNames.push(field.name)
  })


  const filter = recordId? ['_id', '=', recordId]:[];

  const { 
    isLoading: isLoadingRecord, 
    error: errorRecord, 
    data: records, 
    isFetching: isFetchingRecord
  } = useQuery<any>( [objectApiName, filter, fieldNames], async () => {
      return await objectContext.requestRecords(objectApiName, filter, fieldNames);
    },
    { enabled: !!objectSchema } //只有上边的schema加载好了，才启用下边的记录查询
  );

  useEffect(() => { 
    if(records && records.value && records.value.length > 0){
      const record = records.value[0];
      _.forEach(fieldNames, (fieldName:any)=>{
        initialValues[fieldName] = record[fieldName];
      })
    }  
  }, [records]);

  if (isLoadingRecord) return (<div>Loading record ...</div>)

  const onFinish = async(values:any) =>{
    let result; 
    if(mode === 'add'){     
      console.log(values);
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

  let fieldsChildrenDom = props.children;
  if(!fieldsChildrenDom){
    const fieldMode = mode === "add" ? "edit" : mode;
    fieldsChildrenDom = (
      <React.Fragment>
          {_.map(fields, (field:any)=>{
            const fieldItemProps = {
              name: field.name,
              objectApiName,
              fieldName: field.name,
              required: field.required,
              readonly: field.readonly,
              mode: fieldMode,
            };
            return (<ObjectField {...fieldItemProps} />)
          })}
      </React.Fragment>
    );
  }

  return (
    <Form 
      // formFieldComponent = {ObjectField}
      initialValues={initialValues}
      mode={mode}
      layout={layout}
      onFinish={onFinish}
      {...rest}
    >
      {fieldsChildrenDom}
    </Form>
  )
});