import React from 'react';
import ProField from "@ant-design/pro-field";

const numberToString = (number: number | string, scale: number, notThousands: boolean = false)=>{
  if (typeof number === "number") {
    number = number.toString();
  }
  if (!number) {
    return '';
  }
  if (number !== "NaN") {
    if (scale || scale === 0) {
      number = Number(number).toFixed(scale);
    }
    if (!notThousands) {
      if (!(scale || scale === 0)) {
        // 没定义scale时，根据小数点位置算出scale值
        let regDots = number.match(/\.(\d+)/);
        scale = regDots && regDots[1] && regDots[1].length
        if (!scale) {
          scale = 0;
        }
      }
      let reg = /(\d)(?=(\d{3})+\.)/g;
      if (scale === 0) {
        reg = /(\d)(?=(\d{3})+\b)/g;
      }
      number = number.replace(reg, '$1,');
    }
    return number;
  } else {
    return "";
  }
}

const format = (val: string, precision: number = 18, scale: number = 0)=>{
  var _val = new Number(val);
  if (val.indexOf(".") > -1) {
    if (val.length - 1 > precision) {
      return Number(val.substring(0, precision - scale - 1)).toFixed(scale);
    } else {
      return _val.toFixed(scale);
    }
  } else {
    if (val.length > precision) {
      return Number(val.substring(0, precision - scale)).toFixed(scale);
    } else {
      return _val.toFixed(scale);
    }
  }
}

export const FieldNumber = (props:any) => {
  const { mode, fieldProps } = props;
  const { field_schema: fieldSchema = {}, onChange } = fieldProps;
  let value= fieldProps.value || props.text;//ProTable那边fieldProps.value没有值，只能用text
  console.log("===FieldNumber===field_schema===", fieldSchema);
  let scale = fieldSchema.scale;
  let precision = fieldSchema.precision;
  if(mode === "read"){
    return <span>{numberToString(value, scale)}</span>
  }
  else{
    let newFieldProps = Object.assign({}, fieldProps, {
      formatter: (value: any) => {console.log("=formatter===", typeof value);return format(value, precision, scale);},
      parser: (value: any) => value
    });
    return (
      <ProField valueType='digit' {...props} fieldProps={newFieldProps} />
    )
  }
};

FieldNumber.convertNumberToString = numberToString;
FieldNumber.format = format;

// 数值类型字段
// value 值为数字
// 编辑和显示时需要处理小数位数
export const number = {
  render: (text: any, props: any) => {
    return (
      <FieldNumber mode='read' {...props} />
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <FieldNumber mode='edit' {...props} />
    )
  }
}