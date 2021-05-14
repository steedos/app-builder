import { forEach } from 'lodash';
import React, { useState } from 'react';
import { Grid, GridItem, Flex, Box } from '@chakra-ui/layout'

import { ObjectField } from '../components/ObjectField';
import BaseForm from '@ant-design/pro-form/es/BaseForm';
import { Form as AntForm } from 'antd';
import { FieldSection } from '@steedos/builder-form';

/**
 * 对象字段类型组件
 * 定义对象的key,value键值对结构，可在界面编辑该对象结构的数据并保存到数据库中
 * 组件支持属性
 * - name: string
 * - sub_fields: [{name: xx, type: xx, reference_to: xx, multiple: xx, ...}, ...], 字段数组,其元素是每个字段的字义
 * 比如华炎魔方cms_posts对象中有一个members字段，其yml文件定义如下：
 *   members:
      type: object
      label: Members
      is_wide: true
    members.users:
      type: lookup
      label: User Members
      reference_to: users
      multiple: true
      filterable: true
    members.organizations:
      type: lookup
      label: Organization Members
      reference_to: organizations
      multiple: true
      filterable: true
 * 保存到cms_posts表记录中对应为以下效果：
    "members" : {
        "users" : [ 
            "5fdbe2a67447ff11ed5851e5"
        ],
        "organizations" : [ 
            "WNpmGhCzhq5H2y5yZ"
        ]
    }
 * 在这里对应的组件属性为：
    sub_fields: [{
      name: "members.organizations",
      type: "lookup",
      reference_to: "organizations",
      multiple: true
    },{
      name: "members.users",
      type: "lookup",
      reference_to: "users",
      multiple: true
    }]
 */
export const ObjectFieldObject = (props:any) => {
  const [form] = AntForm.useForm();

  const {mode='read', text =[], fieldProps={}} = props;
  const { field_schema: fieldSchema = {}, depend_field_values: dependFieldValues={} } = fieldProps;
  const {value:initialValues, onChange} = fieldProps;
  const {sub_fields={}, columns = 2} = fieldSchema;
  const label = fieldSchema.label? fieldSchema.label: fieldSchema.name

  const getFields = ()=> {
    const fields = [];
    forEach(sub_fields, (field:any, fieldName)=>{
      const fieldItemProps = {
        key: fieldName,
        name: fieldName,
        fieldName: fieldName,
        label: field.label?field.label:fieldName,
        fieldSchema: field,
      };
      fields.push(<ObjectField {...fieldItemProps} />)
    })
    return fields;
  }

  const boxOptions = {
    templateColumns: [`repeat(1, 1fr)`, `repeat(${columns}, 1fr)`],
    gridColumn: 'span 2/span 2',
    gap: '0.5rem 2rem',
  }

  return (
    <BaseForm 
      // formFieldComponent = {ObjectField}
      className='object-sub-form'
      initialValues={initialValues}
      labelAlign='left'
      // mode={mode}
      form={form}
      component={false}  //子表单不创建 html form tag
      submitter={false}
      onValuesChange = {(changedValues:any, allValues:any)=>{
        if (onChange) onChange(allValues)
      }} 
      // layout={layout}
      // onFinish={onFinish}
    >
      <Grid {...boxOptions}>
        {getFields()}
      </Grid>
    </BaseForm>
  )
}

export const object = {
  render: (text: any, props: any) => {
    return (
        <ObjectFieldObject {...props} mode='read'/>
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
        <ObjectFieldObject {...props} mode='edit'/>
    )
  }
}