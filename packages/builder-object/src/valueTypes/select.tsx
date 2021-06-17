import React, { useState } from 'react'
import { isFunction, filter,} from 'lodash';
import FieldSelect from '@ant-design/pro-field/es/components/Select';
import { safeRunFunction } from '../utils';

export const select = {
  render: (text: any, props: any)=> {
    const { valueType, mode, fieldProps, ...rest } = props;
    const { field_schema: fieldSchema = {},depend_field_values: dependFieldValues={} } = fieldProps;
    let tags:any;
    let options = fieldSchema.optionsFunction ? fieldSchema.optionsFunction : fieldSchema.options ;
    options = isFunction(options) ? safeRunFunction(options,[dependFieldValues],[]) : options;
    const value = fieldProps.value || props.text;//ProTable那边fieldProps.value没有值，只能用text
    tags = filter(options,(optionItem: any)=>{
        return fieldSchema.multiple ? value.indexOf(optionItem.value) > -1 : optionItem.value === value;
    })
    return (<React.Fragment>{tags.map((tagItem, index)=>{
      let colorStyle:any = {
        borderRadius: '10px',
        padding: '1px 6px',
        border: '1px',
      }
      if(tagItem.color && tagItem.color.length){
        colorStyle.background='#'+tagItem.color;
      }
      return (
        <React.Fragment key={tagItem.value}>
            {index > 0 && ' '}
            <span style={{...colorStyle}} >
              {tagItem.label}
            </span>
        </React.Fragment>
    )})}</React.Fragment>)
  },
  renderFormItem: (text: any, props: any) => {
    const [params, setParams] = useState({open: false,openTag: null});
    const { fieldProps={} } = props;
    const { field_schema: fieldSchema = {},depend_field_values: dependFieldValues={} } = fieldProps;
    const { multiple ,optionsFunction} = fieldSchema;
    let options = optionsFunction ? optionsFunction : fieldSchema.options;
    if (multiple){
      fieldProps.mode = 'multiple';
    }
    let proFieldProps:any = {};
    let request:any;
    let onDropdownVisibleChange:any;

    if(isFunction(options)){
      request = async (params: any, props: any) => {
        dependFieldValues.__keyWords = params.keyWords;
        const results = await safeRunFunction(options,[dependFieldValues],[]);
        return results;
      };
      onDropdownVisibleChange = (open: boolean) => {
        if (open) {
            setParams({ open, openTag: new Date() });
        }
      }
      proFieldProps = {
        request,
        params,
        onDropdownVisibleChange,
      }
    }else if(options){
      //options为空时不能直接覆盖fieldProps.options中的值，因为要允许直接给控件fieldProps.options赋值
      props.fieldProps.options = options;
    }
    proFieldProps.showSearch=true;
    proFieldProps.optionFilterProp='label';
    // TODO: multiple：如果是true, 后期 需要 支持对已选中项进行拖动排序
    return (
      <FieldSelect mode='edit' {...props} {...proFieldProps} />
    )
  },
}