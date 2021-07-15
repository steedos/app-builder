import React from 'react'
import ProField from "@ant-design/pro-field";
import { CheckIcon } from '@chakra-ui/icons'
import { Switch } from "antd";
import { isNil } from 'lodash'

export const toggle = {
  render: (text: any = true, props: any)=> {
    const { mode, fieldProps } = props;
    const { field_schema, onChange: formOnChange } = fieldProps;
    const { readonly } = field_schema;
    let value = !isNil(fieldProps.value) ? fieldProps.value : props.text;
    if(readonly){
      if(value){
        return (<CheckIcon/>)
      }else{
        return (<span></span>);
      }
    }else{
      return (<Switch checked={value}  disabled={true}/>)
    }   
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <ProField mode='edit' valueType='switch' {...props} />
    )
  }
}

