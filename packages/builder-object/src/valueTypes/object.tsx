import React from 'react';

export const objectValueType = {
  render: (text: any, { fieldProps }: any) => {
    return (<div>object display</div>)
  },
  renderFormItem: (_: any, props: any) => {
    return (<div>object field</div>)
  }
}