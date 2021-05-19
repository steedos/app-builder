import React from 'react'
import ProField from "@ant-design/pro-field";

export const date = (props) => {
  const {value, ...rest} = props

  return (<ProField 
    mode='edit'
    valueType='date' 
    // fieldProps={{
    //   field_schema: fieldSchema
    // }}
    text={value}
    emptyText=''
    />)
}