import React from 'react';
import ProField from "@ant-design/pro-field";
import moment from 'moment';
import FieldDatePicker from "@ant-design/pro-field/es/components/DatePicker";

// 日期时间类型字段
// value 值为GMT标准时间
export const datetime = {
  render: (text: any, props: any) => {
    return (
      <ProField mode='read' valueType='dateTime' {...props} />
    )
  },
  renderFormItem: (text: any, props: any) => {
    const { fieldProps } = props;
    const { defaultValue } = fieldProps;

    if(defaultValue){
      if(moment.isMoment(defaultValue)){
        fieldProps.defaultValue= defaultValue;
      }else{
        fieldProps.defaultValue= moment(defaultValue, "YYYY-MM-DD HH:mm:ss");
      }
    }
    console.log('props==>',props.name, props, defaultValue)
    return (
      <FieldDatePicker text={text as string} format="YYYY-MM-DD HH:mm:ss" showTime {...props} />
    )
  }
}