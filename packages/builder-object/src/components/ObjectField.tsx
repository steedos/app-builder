import React, { useContext } from "react";
// import { BuilderStoreContext } from '@builder.io/react';

import { Field } from '@steedos/builder-form'
import _ from 'lodash';
import { useQuery } from "react-query";
import { ObjectContext } from "../providers/ObjectContext";
import { observer } from "mobx-react-lite"
import { FormContext } from "antd/es/form/context";
import { FormModel, useStore } from '@steedos/builder-store';

export type ObjectFieldProps = {
  objectApiName?: string,
  fieldName: string,
  fieldSchema: any,
}

export const ObjectField = observer((props: any) => {
  const store = useStore();
  const objectContext = useContext(ObjectContext);
  const context = useContext(FormContext);
  const formId = context.name?context.name:'default';
  const { fieldName, fieldSchema } = props
  let objectApiName = props.objectApiName;
  
  /*
    TODO: fieldSchema 如果不存在，应该从对象中获取，但是对象应该从 store 中获取，而不是请求。
  */
  
  // 从对象定义中生成字段信息。
  let mode = store.forms[formId].mode;
  let formFieldProps: any = {
    name: fieldName,
    mode,
    label: fieldSchema.label? fieldSchema.label: fieldName,
    placeholder: fieldSchema.help,
    hidden: fieldSchema.hidden,
    valueType: fieldSchema.type,
    required: fieldSchema.required,
    options: fieldSchema.options,
    readonly: fieldSchema.readonly,
    isWide: fieldSchema.is_wide,
    fieldSchema,
  }

  if (mode == "edit") {

    if (fieldSchema.omit) {
      formFieldProps.hidden = true
    }
  } else if (mode == "read") {
    if (fieldSchema.omit) {
      formFieldProps.readonly = true
    }
  }

  if (formFieldProps.required) {
    formFieldProps.rules = [
      {
        required: true,
        message: `请输入${formFieldProps.label}...`,
      },
    ]
  }

  const formItemProps:any = {
    colon: false,
  }

  return (
    <Field
      formItemProps = {formItemProps}
      {...formFieldProps}
    />
  )
});