import React, { useState ,useEffect } from 'react'
import { isFunction, filter } from 'lodash';
import FieldSelect from '@ant-design/pro-field/es/components/Select';
import { safeRunFunction } from '@steedos/builder-sdk';
import { observer } from "mobx-react-lite";

export const SelectField = observer((props: any) => {
  const { valueType, mode, fieldProps = {}, form, ...rest } = props;
  const [params, setParams] = useState({ open: false, openTag: null });
  const { field_schema: fieldSchema = {}, depend_field_values: dependFieldValues = {} } = fieldProps;
  const { multiple , optionsFunction } = fieldSchema;
  let options = optionsFunction ? optionsFunction : fieldSchema.options;
  const value = fieldProps.value || props.text;//ProTable那边fieldProps.value没有值，只能用text
  let [ fieldsValue ,setFieldsValue ] = useState({});
  // 按原来lookup控件的设计，this.template.data._value为原来数据库中返回的选项值，this.template.data.value为当前用户选中的选项
  const optionsFunctionThis = {
    template: {
      data: {
        value: value,
        _value: value
      }
    }
  };
  const objectApiName = props.object_api_name;
  // useEffect(() => {
  //   console.log('select========')
  //   setFieldsValue(form?.getFieldsValue());
  //   setParams({ open: params.open, openTag: new Date() });
  // }, [dependFieldValues])
  const fieldsValues = Object.assign({}, form?.getFieldsValue() , dependFieldValues);
  let optionsFunctionValues:any = Object.assign({}, fieldsValues || {}, {
    // space: Settings.tenantId,
    _object_name: objectApiName
  });

  if (mode === 'read') {
    let tags = [];
    options = isFunction(options) ? safeRunFunction(options, [optionsFunctionValues], [], optionsFunctionThis) : options;
    tags = filter(options, (optionItem: any) => {
      return multiple ? value.indexOf(optionItem.value) > -1 : optionItem.value === value;
    })
    const tagsDom = tags.map((tagItem, index) => {
      let colorStyle: any = {
        borderRadius: '10px',
        padding: '1px 6px',
        border: '1px',
      }
      if (tagItem.color && tagItem.color.length) {
        colorStyle.background = '#' + tagItem.color;
      }
      return (
        <React.Fragment key={tagItem.value}>
          {index > 0 && ' '}
          <span style={{ ...colorStyle }} >
            {tagItem.label}
          </span>
        </React.Fragment>
      )
    });
    return (<React.Fragment>{tagsDom}</React.Fragment>)
  } 
  else {
    if (multiple) {
      fieldProps.mode = 'multiple';
    }
    let proFieldProps: any = {};
    let request: any;
    let onDropdownVisibleChange: any;

    if (isFunction(options)) {
      request = async (params: any, props: any) => {
        optionsFunctionValues._keyWords = params.keyWords;
        const results = await safeRunFunction(options, [optionsFunctionValues], [], optionsFunctionThis);
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
    } else if (options) {
      //options为空时不能直接覆盖fieldProps.options中的值，因为要允许直接给控件fieldProps.options赋值
      props.fieldProps.options = options;
    }
    proFieldProps.showSearch = true;
    proFieldProps.showArrow = true;
    proFieldProps.optionFilterProp = 'label';
    // TODO: multiple：如果是true, 后期 需要 支持对已选中项进行拖动排序
    return (
      <FieldSelect mode='edit' {...props} {...proFieldProps} />
    )
  }
})

export const select = {
  render: (text: any, props: any) => {
    return (<SelectField {...props} mode="read" />)
  },
  renderFormItem: (text: any, props: any) => {
    return (<SelectField {...props} mode="edit" />)
  }
}