import React from 'react'
import FieldTextArea from "@ant-design/pro-field/es/components/TextArea";

export const textarea = {
  render: (text: any, props: any) => {
    const { fieldProps } = props;
    let value = fieldProps.value || props.text;//ProTable那边fieldProps.value没有值，只能用text
    return (
      <span title={value}
        style={{
          whiteSpace: "pre-wrap"
        }}
      >
        {value}
      </span>
    )
  },
  renderFormItem: (text: any, props: any) => {
    return (
      <FieldTextArea text={text as string} {...props} />
    )
  }
}

