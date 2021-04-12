import React, { useState } from 'react'

import FieldSelect, {
  proFieldParsingText,
  proFieldParsingValueEnumToArray,
} from '@ant-design/pro-field/es/components/Select';
import { Select } from 'antd';

// 需要处理只读样式和多选效果
// const SteedosSelect = (props) => {
//   const {mode, text, fieldSchema={}, onChange, ...rest} = props;
//   const [value, setValue] = useState<any>(text)
//   const {options = []} = fieldSchema;
  
//   if (mode === 'read')
//     return (<span>{value}</span>)
//   else
//     return (
//       <Select {...rest} options={options} mode={mode} 
//         value={value}
//         onChange={(value, optionList, ...rest) => {
//           setValue(value)
//           onChange?.(value, optionList, ...rest);
//           return;
//         }}
//       />
//   )
// }
export const select = {
  render: (text: any, props: any)=> {
    const [value] = useState<any>(text)
    return (<span>{value}</span>)
  },
  renderFormItem: (_: any, props: any) => {
    const {fieldSchema={}} = props;
    const {options = [], multiple ,optionsFunction} = fieldSchema;
    props.fieldProps.options = options
    return (
      <FieldSelect mode='edit' {...props} />
    )
  },
}