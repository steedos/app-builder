import React from 'react';
import ProField from "@ant-design/pro-field";

const getSummaryFieldType = (fieldSchema: any)=>{
  // 零代码会根据汇总类型和要聚合的字段类型自动给data_type赋正确值，低代码需要自己写出正确的data_type值
  // 所以这里不需要去计算汇总字段的数据类型
  return fieldSchema.data_type;
}

const getSummaryFieldScale = (fieldSchema: any)=>{
  // 零代码界面或低代码配置中小数位数是由用户手动配置的
  let scale = fieldSchema.scale;
  if(fieldSchema.summary_type === "count"){
    // 计数汇总强制小数位数为0
    scale = 0;
  }
  return scale
}

export const FieldSummary = (props:any) => {
  const { mode, fieldProps } = props;
  const { field_schema: fieldSchema = {} } = fieldProps;
  const valueType = getSummaryFieldType(fieldSchema);
  const scale = getSummaryFieldScale(fieldSchema);
  let newFieldProps = Object.assign({}, fieldProps, {
    field_schema: {...fieldSchema, scale}
  });
  if(mode === "read"){
    return (
      <ProField {...props} mode='read' valueType={valueType} fieldProps={newFieldProps} />
    )
  }
  else{
    return (
      <ProField {...props} mode='read' valueType={valueType} fieldProps={newFieldProps} />
    )
  }
};

// 累计汇总类型字段
// value 值为服务端自动生成的汇总计算结果
// 值类型可能为：boolean、number、currency、percent、text、date、datetime
// 编辑时只读。显示时直接显示 value
export const summary = {
  render: (text: any, props: any) => {
    return (
      <FieldSummary {...props} />
    )
  },
  renderFormItem: (text: any, props: any) => {
    return (
      <FieldSummary {...props} />
    )
  }
}