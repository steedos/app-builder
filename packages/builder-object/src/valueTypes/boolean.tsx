import React from 'react'
import ProField from "@ant-design/pro-field";
import { CheckIcon } from '@chakra-ui/icons'

export const boolean = {
  render: (text: any, props: any)=> {
    if (text) 
      return (<CheckIcon/>)
    else 
      return (<span></span>);    
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <ProField mode='edit' valueType='switch' {...props} />
    )
  },
}

