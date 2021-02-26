import React from 'react';
import { InputNumber } from 'antd';
import type { ProFieldFC } from '../../index';
import { Input } from 'antd';

export type FieldHrefProps = {
  text: string;
};

/**
 * 数字组件
 *
 * @param FieldHrefProps {
 *     text: number;
 *     moneySymbol?: string; }
 */
const FieldHref: ProFieldFC<FieldHrefProps> = (
  { text, mode: type, render, renderFormItem, fieldProps, ...rest },
  ref,
) => {
  if (type === 'read') {
    const href = <a href={text}>{text}></a>
    const dom = <span ref={ref}>{href}</span>;
    if (render) {
      return render(text, { mode: type, ...fieldProps }, dom);
    }
    return dom;
  }
  if (type === 'edit' || type === 'update') {
    const dom = (
      <Input
        ref={ref}
        style={{
          width: '100%',
        }}
        {...rest}
        {...fieldProps}
      />
    );
    if (renderFormItem) {
      return renderFormItem(text, { mode: type, ...fieldProps }, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldHref);
