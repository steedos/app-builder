import ProField from "@ant-design/pro-field";
import { Form } from 'antd';
import type { InputProps } from 'antd';

import React, { useContext, useState } from "react";
import * as PropTypes from 'prop-types';
import { Flex, Box } from "@chakra-ui/layout"
import { EditIcon, LockIcon } from '@chakra-ui/icons'
import { FormContext } from "antd/es/form/context";
import { ProFormDatePicker } from "@ant-design/pro-form";
import createField from '@ant-design/pro-form/es/BaseForm/createField'

import { ProFormItemProps } from "@ant-design/pro-form/es/interface";
import { Forms } from '@steedos/builder-store';

import { observer } from "mobx-react-lite"
import FieldContext from "@ant-design/pro-form/es/FieldContext";

import './Field.less'

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
    showInlineIcon = valueType != 'object' && valueType != 'grid',
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

  if (valueType == 'object') {
    formItemPropsMerged.style = {gridColumn: 'span 2/span 2'};
    formItemPropsMerged.labelCol = { span: 0 };
    formItemPropsMerged.wrapperCol = { span: 24 };
  } else if (valueType == 'grid') {
    formItemPropsMerged.style = {gridColumn: 'span 2/span 2'};
    formItemPropsMerged.labelCol = { span: 0 };
    formItemPropsMerged.wrapperCol = { span: 24 };
  } else if (isWide) {
    formItemPropsMerged.style = {gridColumn: 'span 2/span 2'};
    formItemPropsMerged.labelCol = { span: 4 };
    formItemPropsMerged.wrapperCol = { span: 20 };
  }

  const ProFieldWrap = observer((props: any) => {

    const { 
      readonly, 
      mode, 
      fieldSchema,
      fieldProps,
      dependFieldValues, ...rest } = props

    const proFieldProps = {
      readonly,
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
      <LockIcon color='gray.600' opacity={inlineIconOpacity} _groupHover={{ opacity: 1 }} /> :
      <EditIcon color='gray.600' opacity={inlineIconOpacity} _groupHover={{ opacity: 1 }}
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
  return (<ProFormField {...rest} mode={mode} formItemProps={formItemPropsMerged} />)
})

Field['propTypes'] = {
  name: PropTypes.string,
  label: PropTypes.string,
  valueType: PropTypes.string,
};