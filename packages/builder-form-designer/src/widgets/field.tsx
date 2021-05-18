import React from 'react'
import ProField from "@ant-design/pro-field";

export const ObjectField = (props) => {
  const {fieldName, valueType, value, ...rest} = props
  return (<ProField 
    mode='read'
    valueType={valueType} 
    // fieldProps={{
    //   field_schema: fieldSchema
    // }}
    text={value}
    emptyText=''
    />)
}