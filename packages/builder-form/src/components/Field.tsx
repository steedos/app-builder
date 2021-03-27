import ProField from "@ant-design/pro-field"
import { Form } from "antd"
import type { InputProps } from "antd"

<<<<<<< HEAD
import React, { useContext, useState } from "react"
=======
import React, { useContext, useState } from "react";
import * as PropTypes from 'prop-types';
>>>>>>> 30b7111fa2ffc8a83306c7bc9ca139c777dca84c
import { Flex, Box } from "@chakra-ui/layout"
import { EditIcon, LockIcon } from "@chakra-ui/icons"
import { FormContext } from "antd/es/form/context"
import { ProFormDatePicker } from "@ant-design/pro-form"
import createField from "@ant-design/pro-form/es/BaseForm/createField"

import { BuilderStoreContext } from "@builder.io/react"
import { ProFormItemProps } from "@ant-design/pro-form/es/interface"
import { store } from "@steedos/builder-store"
import { observer } from "mobx-react-lite"
import FieldContext from "@ant-design/pro-form/es/FieldContext"

export const Field = observer((props: any) => {
  const context = React.useContext(FormContext)
  const formId = context.name ? context.name : "default"
  const {
    attributes,
    // name,
    // label,
    // tooltip,
    // allowClear,
    // placeholder,
    // required,
    readonly,
    // disabled,
    mode: fieldMode,
    valueType,
    // type,
    // count,
    // defaultValue,
    // defaultChecked,
    options,
    ...rest
  } = props

  const mode = store.forms[formId].mode

  const formItemProps = {
    ...attributes,
    style: { borderBottom: mode == "read" ? "1px solid #dddbda" : "" },
  }

  const fieldProps = {
    options,
  }

  if (valueType == "select") {
    fieldProps["showSearch"] = true
    fieldProps["showArrow"] = true
  }

  if (valueType != "switch") {
    fieldProps["style"] = { width: "100%" }
  }

  const ProFieldWrap = observer((props: any) => {
    const { readonly, mode, ...rest } = props

    const proFieldProps = {
      readonly,
      emptyText: "",
      ...rest,
    }

    if (!readonly && mode === "edit")
      return <ProField mode="edit" {...proFieldProps} />

    const onInlineEdit = () => {
      store.forms[formId].setMode("edit")
    }
    const inlineIconOpacity = 0.4
    const inlineIcon = readonly ? (
      <LockIcon
        color="gray.600"
        opacity={inlineIconOpacity}
        _groupHover={{ opacity: 1 }}
      />
    ) : (
      <EditIcon
        color="gray.600"
        opacity={inlineIconOpacity}
        _groupHover={{ opacity: 1 }}
        onClick={() => {
          onInlineEdit()
        }}
      />
    )

    const containerOptions = {
      // borderBottom: (mode=='read')?'1px solid #dddbda':'',
      // pb: 1,
    }

    return (
      <Flex
        {...containerOptions}
        role="group"
        onDoubleClick={() => {
          if (!readonly) onInlineEdit()
        }}
      >
        <Box flex="1">
          <ProField mode="read" {...proFieldProps} />
        </Box>
        <Box width="16px">{inlineIcon}</Box>
      </Flex>
    )
  })

  const ProFormField = createField<ProFormItemProps<InputProps>>(
    (props: ProFormItemProps<InputProps>) => {
      return (
        <ProFieldWrap
          valueType={valueType}
          fieldProps={props.fieldProps}
          {...props.proFieldProps}
          mode={mode}
          readonly={readonly}
        />
      )
    },
    {
      valueType,
    }
  )

  return (
    <ProFormField
      {...rest}
      mode={mode}
      formItemProps={formItemProps}
      fieldProps={fieldProps}
      readonly={readonly}
    />
  )
})
<<<<<<< HEAD
=======

Field['propTypes'] = {
  name: PropTypes.string,
  label: PropTypes.string,
  valueType: PropTypes.string,
};
>>>>>>> 30b7111fa2ffc8a83306c7bc9ca139c777dca84c
