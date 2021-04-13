import React from 'react'
import _ from 'lodash';
import FieldSelect from '@ant-design/pro-field/es/components/Select';

export const select = {
  render: (text: any, props: any)=> {
    const { fieldSchema = {},dependFieldValues={}, valueType, mode, fieldProps, ...rest } = props;
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
    const { fieldSchema={}, fieldProps={}, dependFieldValues={} } = props;
    const { multiple ,optionsFunction} = fieldSchema;
    let options = optionsFunction ? optionsFunction : fieldSchema.options;
    props.fieldProps.options = _.isFunction(options) ? options(dependFieldValues) : options;
    if (multiple){
      fieldProps.mode = 'multiple';
    }
    function filterOption(input, option){
      return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    props.fieldProps.filterOption=filterOption;
    // TODO: multiple：如果是true, 后期 需要 支持对已选中项进行拖动排序
    return (
      <FieldSelect mode='edit' {...props} />
    )
  },
}