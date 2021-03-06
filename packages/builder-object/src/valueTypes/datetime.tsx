import React from 'react';
import ProField from "@ant-design/pro-field";
import moment from 'moment';
import FieldDatePicker from "@ant-design/pro-field/es/components/DatePicker";
import "moment/locale/zh-cn";

// 日期时间类型字段
// value 值为GMT标准时间
export const datetime = {
  render: (text: any, props: any) => {
    return (
      <ProField mode='read' valueType='dateTime' {...props} format="YYYY-MM-DD HH:mm" />
    )
  },
  renderFormItem: (text: any, props: any) => {
    const { fieldProps , format = "YYYY-MM-DD HH:mm"} = props;
    const { defaultValue } = fieldProps;

    if(defaultValue){
      if(moment.isMoment(defaultValue)){
        fieldProps.defaultValue= defaultValue;
      }else{
        fieldProps.defaultValue= moment(defaultValue, format);
      }
    }
    return (
      <FieldDatePicker text={text as string} format={format}  showTime {...props} />
    )
  }
}