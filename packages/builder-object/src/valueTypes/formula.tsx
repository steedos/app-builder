import React from 'react';
import ProField from "@ant-design/pro-field";

const getFormulaFieldType = (fieldSchema: any)=>{
  return fieldSchema.data_type;
}

export const FieldFormula = (props:any) => {
  const { mode, fieldProps } = props;
  const { field_schema: fieldSchema = {} } = fieldProps;
  const valueType = getFormulaFieldType(fieldSchema);
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

// 公式类型字段
// value 值为服务端自动生成的计算结果
// 值类型可能为：boolean、number、currency、percent、text、date、datetime
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