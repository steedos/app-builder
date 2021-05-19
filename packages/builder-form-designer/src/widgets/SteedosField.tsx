import React from 'react'
import ProField from "@ant-design/pro-field";

export const SteedosField = (props) => {
  const {valueType, value, readOnly, onChange, schema, ...rest} = props

  const mode = readOnly?'read':'edit'
  const fieldSchema = {
    readonly: readOnly,
    ...schema
  }
  return (<ProField 
    mode={mode}
    valueType={valueType}
    fieldProps={{
      field_schema: fieldSchema
    }}
    text={value}
    emptyText=''
    />)
}