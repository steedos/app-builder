import React from 'react';

// props.subFields [] 字段数组
// {fieldName: {subField1: 111, subField2:222}}
export const object = {
  render: (text: any, props: any) => {
    return (<div>object display</div>)
  },
  renderFormItem: (_: any, props: any) => {
    return (<div>object field</div>)
  }
}