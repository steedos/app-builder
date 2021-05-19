import React, { useContext } from "react";

import { Field } from '@steedos/builder-form'
import _ from 'lodash';
import { useQuery } from "react-query";
import { observer } from "mobx-react-lite"
import { FormContext } from "antd/es/form/context";
import { ProFormDependency } from '@ant-design/pro-form';
import useAntdMediaQuery from 'use-media-antd-query';
import { Forms } from '@steedos/builder-store';

export type ObjectFieldProps = {
  objectApiName?: string,
  fieldName: string,
  fieldSchema: any,
}

export const ObjectField = (props: any) => {
  const context = useContext(FormContext);
  const formId = context.name?context.name:'default';
  const { objectApiName, fieldName, fieldSchema, ...rest } = props
  
  const colSize = useAntdMediaQuery();
  const isMobile = (colSize === 'sm' || colSize === 'xs') && !props.disableMobile;
  if (isMobile)
    fieldSchema.is_wide = true
  /*
    TODO: fieldSchema 如果不存在，应该从对象中获取，但是对象应该从 store 中获取，而不是请求。
  */
  // 从对象定义中生成字段信息。
  let mode = Forms.loadById(formId).mode;
  let formFieldProps: any = {
    name: fieldName,
    mode,
    label: fieldSchema.label? fieldSchema.label: fieldName,
    placeholder: fieldSchema.help,
    hidden: fieldSchema.hidden,
    valueType: fieldSchema.type,
    required: fieldSchema.required,
    // options: fieldSchema.options,
    readonly: fieldSchema.readonly,
    isWide: fieldSchema.is_wide,
    fieldSchema,
    ...rest
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

  const dependOn = fieldSchema.depend_on ? fieldSchema.depend_on : []
  console.log(`ObjectField`, formFieldProps)
  return (
    <ProFormDependency name={dependOn}>
      {(dependFieldValues) => {
        return (
          <Field
            formItemProps={formItemProps}
            dependFieldValues={dependFieldValues}
            {...formFieldProps}
          />)
      }}
    </ProFormDependency>
  )
};