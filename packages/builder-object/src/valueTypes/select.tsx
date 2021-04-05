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
  const [selectedRecords, setSelectedRecords] = useState<any>(text)
  const {options = []} = fieldSchema;
  
  if (mode === 'read')
    return (<span>{selectedRecords}</span>)
  else
    return (
      <Select {...rest} options={options} mode={mode} 
        value={selectedRecords}
        onChange={(value, optionList, ...rest) => {
          setSelectedRecords(value)
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

