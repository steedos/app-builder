import React, { useState } from 'react'
import _ from 'lodash';
import FieldSelect from '@ant-design/pro-field/es/components/Select';

export const select = {
  render: (text: any, props: any)=> {
    const { valueType, mode, fieldProps, ...rest } = props;
    const { fieldSchema = {},dependFieldValues={} } = fieldProps;
    let tags:any;
    let options = fieldSchema.optionsFunction ? fieldSchema.optionsFunction : fieldSchema.options ;
    options = _.isFunction(options) ? options(dependFieldValues) : options;
    const value = fieldProps.value;
    tags = _.filter(options,(optionItem: any)=>{
        return fieldSchema.multiple ? value.indexOf(optionItem.value) > -1 : optionItem.value === value;
    })
    return (<React.Fragment>{tags.map((tagItem, index)=>{return (
        <React.Fragment key={tagItem.value}>
            {index > 0 && ', '}
            { (tagItem.label) }
        </React.Fragment>
    )})}</React.Fragment>)
  },
  renderFormItem: (text: any, props: any) => {
    const [params, setParams] = useState({open: false,openTag: null});
    const { fieldProps={} } = props;
    const { fieldSchema = {},dependFieldValues={} } = fieldProps;
    const { multiple ,optionsFunction} = fieldSchema;
    let options = optionsFunction ? optionsFunction : fieldSchema.options;
    if (multiple){
      fieldProps.mode = 'multiple';
    }
    let proFieldProps:any = {};
    let request:any;
    let onDropdownVisibleChange:any;

    if(_.isFunction(options)){
      request = async (params: any, props: any) => {
        dependFieldValues.__keyWords = params.keyWords;
        const results = await options(dependFieldValues);
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
    }else{
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