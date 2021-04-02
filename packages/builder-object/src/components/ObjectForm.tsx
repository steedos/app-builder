
import React, { useContext, useEffect, useState } from "react";
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
import { FieldSection } from "@steedos/builder-form";

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
  const {
    objectApiName,
    initialValues = {},
    fields = [],
    recordId = '',
    name: formId = 'default',
    mode = 'edit', 
    layout = 'vertical',
    children,
    ...rest
  } = props;
 
  const store = useMst();
  const objectContext = useContext(ObjectContext);
  const [fieldSchemas, setFieldSchemas] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);

  if (!store.forms[formId])
    store.forms[formId] = FormModel.create({id: formId, mode});
  
  const objectQuery = useQuery<any>({ queryKey: objectApiName, queryFn: async () => {
    const data = await objectContext.requestObject(objectApiName as string);
    fieldSchemas.length = 0
    _.mapKeys(data.fields, (field, fieldName) => {
      if (!field.hidden && (!fields.length || fields.includes(fieldName)))
        fieldSchemas.push(_.defaults({name: fieldName}, field, {group: 'General'}))
    })
    _.forEach(fieldSchemas, (field:any)=>{
      fieldNames.push(field.name)
    })
    setFieldNames(fieldNames)
    setFieldSchemas(fieldSchemas)
    return data
  }});


  const filter = recordId? ['_id', '=', recordId]:[];
  
  const recordsQuery = useQuery<any>( [objectApiName, filter, fieldNames], async () => {
      const records = await objectContext.requestRecords(objectApiName, filter, fieldNames);
      if(records && records.value && records.value.length > 0){
        const record = records.value[0];
        _.forEach(fieldNames, (fieldName:any)=>{
          initialValues[fieldName] = record[fieldName];
        })
      }
    },
    { enabled: objectQuery.isSuccess } //只有上边的schema加载好了，才启用下边的记录查询
  );

  if (!objectQuery.isSuccess || !recordsQuery.isSuccess) return (<div>Loading record ...</div>)

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

  const getSection = (sectionName) => {
    const fieldMode = mode === "add" ? "edit" : mode;
    const sectionFields = _.filter(fieldSchemas, { 'group': sectionName });
    return (
      <FieldSection title={sectionName}>
        {_.map(sectionFields, (field:any)=>{
          const fieldItemProps = {
            name: field.name,
            objectApiName,
            fieldName: field.name,
            label: field.label,
            fieldSchema: field,
            required: field.required,
            readonly: field.readonly,
            mode: fieldMode,
          };
          return (<ObjectField {...fieldItemProps} />)
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