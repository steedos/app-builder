import React from 'react';
import { FieldNumberRange } from "./number_range";

export const currency_range = {
  render: (text: any, props: any) => {
    return (<FieldNumberRange {...props} mode="read" valueType="currency" />)
  },
  renderFormItem: (_: any, props: any) => {
    return (<FieldNumberRange {...props} mode="edit" valueType="currency" />);
  }
}