import ProField from "@ant-design/pro-field";
import type { InputProps } from 'antd';

import React, { useContext, useState } from "react";
import * as PropTypes from 'prop-types';
import { Flex, Box } from "@chakra-ui/layout"
import { FormContext } from "antd/es/form/context";
import createField from '@ant-design/pro-form/es/BaseForm/createField'

import { ProFormItemProps } from "@ant-design/pro-form/es/interface";
import { Forms } from '@steedos/builder-store';

import { observer } from "mobx-react-lite"
import Button from '@salesforce/design-system-react/components/button'; 

import './Field.less'

const ProFieldWrap = observer((props: any) => {
  const {
    formId,
    showInlineIcon,
    readonly, 
    mode, 
    fieldSchema,
    fieldProps,
    dependFieldValues,proFieldProps: defaultProFieldProps, ...rest } = props

  const proFieldProps = {
    emptyText: '',
    fieldProps: Object.assign({}, fieldProps, {
      field_schema: fieldSchema,
      depend_field_values: dependFieldValues,
    }),
    ...rest
  }

  if (!readonly && mode === 'edit') {
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
    // placeholder,
    // required,
    readonly,
    // referenceTo,
    // disabled,
    mode: fieldMode,
    valueType,
    isWide = false,
    showInlineIcon = true, //valueType != 'object' && valueType != 'grid',
    formItemProps = {},
    // type,
    // count,
    // defaultValue,
    // defaultChecked,
    // options,
    ...rest
  } = props

  const mode = Forms.loadById(formId).mode
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
      formItemPropsMerged.labelCol = { span: 4 };
      formItemPropsMerged.wrapperCol = { span: 24 };
    } else {
      formItemPropsMerged.labelAlign = 'left'
      formItemPropsMerged.labelCol = { span: 3 };
      formItemPropsMerged.wrapperCol = { span: 21 };
    }
  } else {
    if (context.vertical) {
      formItemPropsMerged.labelCol = { span: 4 };
      formItemPropsMerged.wrapperCol = { span: 24 };
    } else {
      formItemPropsMerged.labelAlign = 'left'
      formItemPropsMerged.labelCol = { span: 6 };
      formItemPropsMerged.wrapperCol = { span: 18 };
    }

  }

  if(!FieldsMap[`${valueType}_${mode}`]){
    const ProFormField = createField<ProFormItemProps<InputProps>>(
      (props: ProFormItemProps<InputProps>) => {
        return (
          <ProFieldWrap valueType={valueType} {...props} mode={mode} readonly={readonly} formId={formId} showInlineIcon={showInlineIcon}/>
        )
      },
      {
        valueType,
      },
    );
    FieldsMap[`${valueType}_${mode}`] = ProFormField;
  }
  const SField = FieldsMap[`${valueType}_${mode}`];
  return (<SField {...rest} mode={mode} formItemProps={formItemPropsMerged} />)
})

Field['propTypes'] = {
  name: PropTypes.string,
  label: PropTypes.string,
  valueType: PropTypes.string,
};