import React from 'react'
import ProField from "@ant-design/pro-field";

export const text = (props) => {
  const {value, ...rest} = props
  return (<ProField 
    mode='edit'
    valueType='text' 
    // fieldProps={{
    //   field_schema: fieldSchema
    // }}
    text={value}
    emptyText=''
    />)
}