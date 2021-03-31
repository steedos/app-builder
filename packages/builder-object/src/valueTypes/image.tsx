import React from 'react';

export const imageValueType = {
  render: (text: any, { fieldProps }: any) => {
    return (<div>image display</div>)
  },
  renderFormItem: (_: any, props: any) => {
    return (<div>image edit</div>)
  }
}