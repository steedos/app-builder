import React from 'react'
import { Field } from "@steedos/builder-form";
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
      <Field mode='edit' valueType='switch' {...props} />
    )
  },
}

