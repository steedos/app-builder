import React, { useContext } from 'react';
import * as PropTypes from 'prop-types';

import { Grid, GridItem, Flex, Box } from '@chakra-ui/layout'
import { Form as AntForm } from 'antd';
import BaseForm from '@ant-design/pro-form/es/BaseForm';
import ProForm, {
  ModalForm,
  DrawerForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-form';
import { observer } from "mobx-react-lite"
import { isBoolean } from 'lodash'

import { Forms } from '@steedos/builder-store';

// 在 ProForm的基础上扩展属性
// colSpan: 每一列默认占几栅格，总共12栅格
// mode: edit, read

export const Form = observer((props:any) => {
  const {
    name: formId = 'default',
    mode= 'read', 
    layout,
    children,
    submitter,
    isModalForm,
    isDrawerForm,
    modalProps,
    trigger,
    ...rest
  } = props

  const form = Forms.loadById(formId);

  const formItemLayout =
    layout === 'horizontal'
      ? {
          labelAlign: 'left',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        }
      : null;

  const defSubmitter = form.mode ==='read'? false : {
    // 配置按钮文本
    searchConfig: {
      resetText: '取消',
      submitText: '提交',
    },
    // resetButtonProps: {
    //   onClick: () => {
    //     form.setMode('read')
    //   },
    // },
    // 这里不可以设置resetButtonProps属性，因为弹出窗口功能中依赖了resetButtonProps.onClick属性来关闭窗口，设置这个属性会把关闭窗口功能覆盖了
    // 实在要设置resetButtonProps属性，就需要在这里实现弹出窗口的visible功能
    onReset: ()=>{
      form.setMode('read')
    }
  }
  let _submitter = false
  if(form.mode !='read'){
    _submitter = isBoolean(submitter) ? submitter : submitter || defSubmitter;
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
    submitter: _submitter,
    trigger,
    contentRender,
    modalProps: {
      // 默认加destroyOnClose这个是为了弹出Form时点击取消按钮能重置表单项值
      // 还有另一个可能的方案是设置modalProps?.onCancel属性，并在其中调用一次表单重围函数
      destroyOnClose: true,
      ...modalProps,
    },
  }

  let FormComponent = BaseForm;
  if(isModalForm || trigger){
    FormComponent = ModalForm
  }

  if(isDrawerForm){
    FormComponent = DrawerForm
  }

  return (
      <FormComponent {...formProps}>
          {children}
      </FormComponent>
  )
});


Form['propTypes'] = {
  name: PropTypes.string,
  mode: PropTypes.string,
  layout: PropTypes.string,
  initialValues: PropTypes.object,
};