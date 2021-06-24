import ProField from "@ant-design/pro-field";
import type { InputProps } from 'antd';
import { API } from "@steedos/builder-store"
import { isFunction, isNil } from 'lodash';

import React, { useContext, useState } from "react";
import * as PropTypes from 'prop-types';
import { Flex, Box } from "@chakra-ui/layout"
import { FormContext } from "antd/es/form/context";
import createField from '@ant-design/pro-form/es/BaseForm/createField'

import { ProFormItemProps } from "@ant-design/pro-form/es/interface";
import { Forms } from '@steedos/builder-store';

import { observer } from "mobx-react-lite"
import Button from '@salesforce/design-system-react/components/button'; 
import { safeRunFunction } from '@steedos/builder-sdk';

import './Field.less'

const FieldsMap = {};

export const Field = observer((props: any) => {
  const context = React.useContext(FormContext);
  const formId = context.name ? context.name : 'default';
  const {
    attributes,
    // name, 
    // label, 
    // tooltip, 
    // allowClear,
    placeholder = '',
    // required,
    readonly,
    // referenceTo,
    // disabled,
    mode: fieldMode,
    valueType,
    isWide = false,
    showInlineIcon = true, //valueType != 'object' && valueType != 'grid',
    formItemProps = {},
    objectApiName,
    // type,
    // count,
    // defaultValue,
    // defaultChecked,
    // options,
    ...rest
  } = props

  const mode = fieldMode ? fieldMode : Forms.loadById(formId).mode
  const formItemPropsMerged = {
    ...attributes,
    ...formItemProps,
    className: `field type-${valueType} mode-${mode}`,
  }

  // if (valueType == 'object') {
  //   formItemPropsMerged.style = {gridColumn: 'span 2/span 2'};
  //   formItemPropsMerged.labelCol = { span: 0 };
  //   formItemPropsMerged.wrapperCol = { span: 24 };
  // } else if (valueType == 'grid') {
  //   formItemPropsMerged.style = {gridColumn: 'span 2/span 2'};
  //   formItemPropsMerged.labelCol = { span: 0 };
  //   formItemPropsMerged.wrapperCol = { span: 24 };
  // } else 
  if (isWide) {
    formItemPropsMerged.style = {gridColumn: 'span 2/span 2'};
    if (context.vertical) {
      // formItemPropsMerged.labelCol = { span: 24 };
      // formItemPropsMerged.wrapperCol = { span: 24 };
    } else {
      formItemPropsMerged.labelAlign = 'left'
      formItemPropsMerged.labelCol = { span: 3 };
      formItemPropsMerged.wrapperCol = { span: 21 };
    }
  } else {
    if (context.vertical) {
      // formItemPropsMerged.labelCol = { span: 24 };
      // formItemPropsMerged.wrapperCol = { span: 24 };
    } else {
      formItemPropsMerged.labelAlign = 'left'
      formItemPropsMerged.labelCol = { span: 6 };
      formItemPropsMerged.wrapperCol = { span: 18 };
    }

  }

  const ProFieldWrap = observer((props: any) => {

    const { 
      readonly, 
      mode, 
      fieldSchema,
      fieldProps,
      dependFieldValues,proFieldProps: defaultProFieldProps, ...rest } = props

    const proFieldProps = {
      emptyText: '',
      fieldProps: Object.assign({}, fieldProps, {
        field_schema: fieldSchema,
        placeholder,
        depend_field_values: dependFieldValues,
      }),
      ...rest
    }

    if (!readonly && mode === 'edit') {
      let defaultValue = fieldSchema?.defaultValue;
      if(isFunction(defaultValue)){
        defaultValue = safeRunFunction(defaultValue,[]);
      }
      if (fieldProps.value === undefined && !isNil(defaultValue)) {
        let formValue = defaultValue;
        if(formValue === '{userId}'){
          formValue = [API.client.getUserId()];
        }
        proFieldProps.fieldProps.onChange(formValue);
        proFieldProps.fieldProps.defaultValue = formValue;
      }
      return <ProField mode='edit' {...proFieldProps} />

    }

    const onInlineEdit = () => {
      Forms.loadById(formId).setMode('edit')
    };
    const inlineIconOpacity = 0.4
    const inlineIcon = readonly ?
      <Button
        iconCategory="utility"
        iconName="lock"
        iconSize="small"
        iconVariant="container"
        iconClassName="slds-button__icon slds-button__icon_hint"
        variant="icon"/> :
      <Button
        iconCategory="utility"
        iconName="edit"
        iconSize="small"
        iconVariant="container"
        iconClassName="slds-button__icon slds-button__icon_hint"
        variant="icon"
        //<EditIcon color='gray.600' opacity={inlineIconOpacity} _groupHover={{ opacity: 1 }}
        onClick={() => {
          onInlineEdit()
        }}
      />


    const containerOptions = {
    }

    return (
      <Flex
        {...containerOptions}
        role="group"
        onDoubleClick={() => { if (!readonly) onInlineEdit(); }}
      >
        <Box flex="1"><ProField mode='read' {...proFieldProps} /></Box>
        {showInlineIcon && (<Box width="16px">{inlineIcon}</Box>)}
      </Flex>
    )
  })

  if(!FieldsMap[`${valueType}_${mode}_${readonly}`]){
    const ProFormField = createField<ProFormItemProps<InputProps>>(
      (props: ProFormItemProps<InputProps>) => {
        return (
          <ProFieldWrap valueType={valueType} {...props} mode={mode} readonly={readonly} />
        )
      },
      {
        valueType,
      },
    );
    FieldsMap[`${valueType}_${mode}_${readonly}`] = ProFormField;
  }
  const SField = FieldsMap[`${valueType}_${mode}_${readonly}`];
  return (<SField formId={formId} object_api_name={objectApiName} {...rest} mode={mode} formItemProps={formItemPropsMerged} />)
})

Field['propTypes'] = {
  name: PropTypes.string,
  label: PropTypes.string,
  valueType: PropTypes.string,
};