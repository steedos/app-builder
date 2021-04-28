import React from 'react';
import {ImageField} from './image'

// 和image相同, 唯一不同的是 fileType 值。
export const avatar = {
  render: (text: any, props: any) => {
    return (<ImageField {...props} mode="read" fileType="avatars"></ImageField>)
  },
  renderFormItem: (text: any, props: any) => {
    return (<ImageField {...props} mode="edit" fileType="avatars"></ImageField>)
  }
}

