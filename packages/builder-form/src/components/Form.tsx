import React, { useContext } from 'react';
import * as PropTypes from 'prop-types';

import { Grid, GridItem, Flex, Box } from '@chakra-ui/layout'
import { Form as AntForm } from 'antd';
import BaseForm from '@ant-design/pro-form/es/BaseForm';
import { observer } from "mobx-react-lite"
import _ from 'lodash'

import { FormModel, Forms } from '@steedos/builder-store';

// 在 ProForm的基础上扩展属性
// colSpan: 每一列默认占几栅格，总共12栅格
// mode: edit, read

export const Form = observer((props:any) => {
  const {
    name: formId = 'default',
    mode= 'read', 
    layout,
    children, 
    ...rest
  } = props

  const form = Forms.loadById(formId);

  const formItemLayout =
    layout === 'horizontal'
      ? {
          labelAlign: 'left',
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        }
      : null;

  const submitter = form.mode ==='read'? false : {
    // 配置按钮文本
    searchConfig: {
      resetText: '取消',
      submitText: '提交',
    },
    resetButtonProps: {
      onClick: () => {
        form.setMode('read')
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
    className: 'builder-form',
    mode: form.mode, 
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