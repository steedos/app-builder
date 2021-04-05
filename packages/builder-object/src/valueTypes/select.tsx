import React from 'react'

import FieldSelect, {
  proFieldParsingText,
  proFieldParsingValueEnumToArray,
} from '@ant-design/pro-field/es/components/Select';

const SteedosSelect = (props, mode) => {
  const {text =[], fieldSchema={}, fieldProps} = props;
  const {options = []} = fieldSchema;
  fieldProps.options = options;

  return (
    <FieldSelect {...props} fieldProps={fieldProps} mode={mode} />
  )
}
export const select = {
  render: (text: any, props: any)=> {
    return (
      <SteedosSelect mode='read' {...props} />
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <SteedosSelect mode='edit' {...props} />
    )
  },
}

