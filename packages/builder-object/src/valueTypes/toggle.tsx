import React, { useState }  from 'react'
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
    const { fieldProps } = props;
    const { onChange: formOnChange } = fieldProps;
    let value = !isNil(fieldProps.value) ? fieldProps.value : props.text;
    const [checked, setChecked] = useState(value);
    function onChange(check: boolean,event: Event) {
      formOnChange(check);
      setChecked(check);
    }
    return (<Switch onChange={onChange} checked={checked}></Switch>)
  }
}

