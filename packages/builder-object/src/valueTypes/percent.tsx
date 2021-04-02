import React, { Fragment, useMemo } from 'react';

import toNumber from 'lodash.tonumber';
import ProField from "@ant-design/pro-field";

// 百分比类型字段
// value 值为数字
// 编辑和显示时需要处理小数位数
export const percent = {
  render: (text: any, props: any) => {

    const realValue = useMemo(
      () =>
        typeof text === 'string' && (text as string).includes('%')
          ? 100*toNumber((text as string).replace('%', ''))
          : 100*toNumber(text),
      [text],
    );
    return (
      <span>{realValue}%</span>
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <ProField mode='edit' valueType='digit' {...props} />
    )
  }
}