import React from 'react';
import ProField from "@ant-design/pro-field";
import { Input } from "antd";
import { observer } from "mobx-react-lite";

export const FieldNumberRange = observer((props:any) => {
  const { fieldProps, mode, valueType, ...rest } = props;
  let value= fieldProps.value || props.text;//ProTable那边fieldProps.value没有值，只能用text
  if(!value){
    value = [];
  }
  const { onChange } = fieldProps;
  const beginInputProps = {
    mode,
    valueType: valueType || "digit",
    onChange: (v)=>{
      onChange([v, value[1]]);
    }
  };
  const endInputProps = {
    mode,
    valueType: valueType || "digit",
    onChange: (v)=>{
      onChange([value[0], v]);
    }
  };
  return (
    <Input.Group compact>
      <ProField
        className="hover:border-r"
        style={{ 
          width: 100,
          borderRightWidth: 0
        }}
        placeholder="起始值"
        {...rest}
        {...beginInputProps}
      />
      <Input
        style={{
          width: 30,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          pointerEvents: "none",
          backgroundColor: "transparent"
        }}
        placeholder="~"
        disabled
      />
      <ProField
        className="hover:border-l"
        style={{
          width: 100,
          borderLeftWidth: 0
        }}
        placeholder="结束值"
        {...rest}
        {...endInputProps}
      />
    </Input.Group>
  )
});

export const number_range = {
  render: (text: any, props: any) => {
    return (<FieldNumberRange {...props} mode="read" valueType="number" />)
  },
  renderFormItem: (_: any, props: any) => {
    return (<FieldNumberRange {...props} mode="edit" valueType="number" />);
  }
}