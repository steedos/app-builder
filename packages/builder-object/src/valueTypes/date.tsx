import React from 'react';
import moment from 'moment';
import FieldDatePicker from "@ant-design/pro-field/es/components/DatePicker";
import "moment/locale/zh-cn";
import { onChange } from '@builder.io/react';

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
    const { onChange: formOnChange, defaultValue } = fieldProps;

    if(defaultValue){
      if(moment.isMoment(defaultValue)){
        fieldProps.defaultValue= defaultValue;
      }else{
        fieldProps.defaultValue= moment(defaultValue, format);
      }
    }
    // 重写onChange()并且修改formOnChange()传入值的原因是： 当(0-8点期间)点击控件里的 ‘今天' 会导致（选择的）2021-07-16 ==> （最终保存为）2021-07-15;
    function onChange(date, dateString: string){
      formOnChange(dateString)
    }
    let newFieldProps = Object.assign({}, {...fieldProps}, {
      onChange
    })
    return (
      <FieldDatePicker text={text as string} format={format} {...props} fieldProps={newFieldProps} />
    )
  }
}