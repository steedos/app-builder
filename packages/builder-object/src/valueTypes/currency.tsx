import React from 'react';
import { FieldNumber } from "./number";
import { isNil} from 'lodash';

// 金额类型字段，跟数值字段比，只是默认小数位数变成2位了
// value 值为数字
// 编辑和显示时需要处理小数位数
export const currency = {
  render: (text: any, props: any) => {
    const { fieldProps } = props;
    const { field_schema: fieldSchema = {} } = fieldProps;
    let scale = isNil(fieldSchema.scale) ? 2 : fieldSchema.scale;
    let newFieldProps = Object.assign({}, fieldProps, {
      field_schema: {...fieldSchema, scale}
    });
    return (
      <FieldNumber mode='read' {...props} fieldProps={newFieldProps} />
    )
  },
  renderFormItem: (_: any, props: any) => {
    const { fieldProps } = props;
    const { field_schema: fieldSchema = {} } = fieldProps;
    let scale = isNil(fieldSchema.scale) ? 2 : fieldSchema.scale;
    let newFieldProps = Object.assign({}, fieldProps, {
      field_schema: {...fieldSchema, scale}
    });
    return (
      <FieldNumber mode='edit' {...props} fieldProps={newFieldProps} />
    )
  }
}