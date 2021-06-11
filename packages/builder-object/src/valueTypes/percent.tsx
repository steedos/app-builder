import React, { Fragment, useMemo } from 'react';
import { FieldNumber } from "./number";
import toNumber from 'lodash.tonumber';

// 百分比类型字段
// value 值为数字，值显示为带百分号的字符串
// 配置的小数位数指的是显示为百分比后的小数位数，比如20.50%表示小数位数为2，值为0.205，编辑时按4位小数位处理
// 编辑和显示时需要处理小数位数
export const percent = {
  render: (text: any, props: any) => {
    const { fieldProps } = props;
    let value= fieldProps.value || text;//ProTable那边fieldProps.value没有值，只能用text
    let newFieldProps = Object.assign({}, fieldProps, {
      value: toNumber(value) * 100
    });
    return (
      <span>{<FieldNumber mode='read' {...props} fieldProps={newFieldProps} />}%</span>
    )
  },
  renderFormItem: (_: any, props: any) => {
    const { fieldProps } = props;
    const { field_schema: fieldSchema = {} } = fieldProps;
    let scale = (fieldSchema.scale || 0) + 2;//编辑时控件中小数位数始终比配置的位数多2位
    let newFieldProps = Object.assign({}, fieldProps, {
      field_schema: {...fieldSchema, scale}
    });
    return (
      <FieldNumber mode='edit' {...props} fieldProps={newFieldProps} />
    )
  }
}