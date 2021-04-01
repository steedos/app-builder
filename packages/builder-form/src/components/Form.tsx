import React, { useContext } from 'react';
import * as PropTypes from 'prop-types';

import { Grid, GridItem, Flex, Box } from '@chakra-ui/layout'
import { Form as AntForm } from 'antd';
import BaseForm from '@ant-design/pro-form/es/BaseForm';
import { BuilderStoreContext } from '@builder.io/react';
import { observer } from "mobx-react-lite"
import _ from 'lodash'

import { FormModel, useMst } from '@steedos/builder-store/src';

// 在 ProForm的基础上扩展属性
// colSpan: 每一列默认占几栅格，总共12栅格
// mode: edit, read

export const Form = observer((props:any) => {
  const store = useMst();
  const {
    name: formId = 'default',
    mode= 'read', 
    layout,
    children, 
    ...rest
  } = props

  if (!store.forms[formId])
    store.forms[formId] = FormModel.create({id: formId, mode});
 
  const formItemLayout =
    layout === 'horizontal'
      ? {
          labelAlign: 'left',
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        }
      : null;

  const submitter = store.forms[formId].mode ==='read'? false : {
    // 配置按钮文本
    searchConfig: {
      resetText: '取消',
      submitText: '提交',
    },
    resetButtonProps: {
      onClick: () => {
        store.forms[formId].setMode('read')
      },
    },
  }

  const contentRender = (items:any, submitter:any) => {
    return (
      <>
        {items}
        {submitter}
      </>
    );
  }

  const formProps = {
    name: formId,
    mode: store.forms[formId].mode, 
    layout,
    ...formItemLayout,
    ...rest,
    submitter,
    contentRender,
  }

  return (
      <BaseForm {...formProps}>
          {children}
      </BaseForm>
  )
});


Form['propTypes'] = {
  name: PropTypes.string,
  mode: PropTypes.string,
  layout: PropTypes.string,
  initialValues: PropTypes.object,
};