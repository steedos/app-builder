import React, { useState } from 'react'

import FieldSelect, {
  proFieldParsingText,
  proFieldParsingValueEnumToArray,
} from '@ant-design/pro-field/es/components/Select';
import { Select } from 'antd';

// 需要处理只读样式和多选效果
const SteedosSelect = (props, mode) => {
  console.log(props)
  const {text, fieldSchema={}, onChange, ...rest} = props;
  const [value, setValue] = useState<any>(text)
  const {options = []} = fieldSchema;
  
  if (mode === 'read')
    return (<span>{value}</span>)
  else
    return (
      <Select {...rest} options={options} mode={mode} 
        value={value}
        onChange={(value, optionList, ...rest) => {
          setValue(value)
          onChange?.(value, optionList, ...rest);
          return;
        }}
      />
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

