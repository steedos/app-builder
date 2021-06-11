import React from 'react';
import ProField from "@ant-design/pro-field";

const getFormulaFieldType = (dataType: string)=>{
  return dataType;
}

export const FieldFormula = (props:any) => {
  const { mode, fieldProps } = props;
  const { field_schema: fieldSchema = {} } = fieldProps;
  const valueType = getFormulaFieldType(fieldSchema.data_type);
  if(mode === "read"){
    return (
      <ProField {...props} mode='read' valueType={valueType} />
    )
  }
  else{
    return (
      <ProField {...props} mode='read' valueType={valueType} />
    )
  }
};

// 公式类型类型字段
// value 值为服务端自动生成的字符串
// 编辑时只读。显示时直接显示 value
export const formula = {
  render: (text: any, props: any) => {
    return (
      <FieldFormula {...props} />
    )
  },
  renderFormItem: (text: any, props: any) => {
    return (
      <FieldFormula {...props} />
    )
  }
}