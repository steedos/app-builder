import React from 'react';
import moment from 'moment';
import FieldDatePicker from "@ant-design/pro-field/es/components/DatePicker";
import "moment/locale/zh-cn";

// 日期类型字段
// value 值为GMT标准时间的0点
export const date = {
  render: (text: any, props: any) => {
    return (
      <FieldDatePicker text={text as string} format="YYYY-MM-DD" {...props} />
    )
  },
  renderFormItem: (text: any, props: any) => {
    const { fieldProps , format = "YYYY-MM-DD"} = props;
    const { defaultValue } = fieldProps;

    if(defaultValue){
      if(moment.isMoment(defaultValue)){
        fieldProps.defaultValue= defaultValue;
      }else{
        fieldProps.defaultValue= moment(defaultValue, format);
      }
    }
    return (
      <FieldDatePicker text={text as string} format={format} {...props} />
    )
  }
}