import React from 'react'
import { CheckIcon } from '@chakra-ui/icons'
import { Checkbox } from 'antd';
import Button from '@salesforce/design-system-react/components/button'; 

export const boolean = {
  render: (text: any, props: any)=> {
    const { fieldProps } = props;
    const { field_schema } = fieldProps;
    const { readonly } = field_schema;
    let value = fieldProps.value || props.text;
    if (value){
      return (<CheckIcon/>)
    }
    else{
      if (readonly) {
        return (<span></span>);
      } else {
        return (
          <Button
            iconCategory="utility"
            iconName="steps"
            iconSize="small"
            iconVariant="container"
            iconClassName="slds-button__icon slds-button__icon_hint"
            variant="icon" />
        );
      }
    }
  },
  renderFormItem: (text: any, props: any) => {
    const { fieldProps } = props;
    const { onChange: formOnChange } = fieldProps;
    let value = fieldProps.value || props.text;
    function onChange(e) {
      formOnChange(e.target.checked);
    }
    return (<Checkbox onChange={onChange} checked={value}></Checkbox>)
  },
}

