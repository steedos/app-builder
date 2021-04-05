import _ from 'lodash';
import React, { useState } from 'react';

import { ObjectField } from '../components/ObjectField';
import BaseForm from '@ant-design/pro-form/lib/BaseForm';
import { Form as AntForm } from 'antd';

/**
 * 对象字段类型组件
 * 定义对象的key,value键值对结构，可在界面编辑该对象结构的数据并保存到数据库中
 * 组件支持属性
 * - name: string
 * - subFields: [{name: xx, type: xx, reference_to: xx, multiple: xx, ...}, ...], 字段数组,其元素是每个字段的字义
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
    subFields: [{
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
const FieldObject = (props:any) => {
  console.log(props)
  const [form] = AntForm.useForm();

  const {mode='read', text =[], objectApiName, fieldSchema={}, fieldProps={}} = props;
  const {value:initialValues, onChange} = fieldProps;
  const {subFields=[]} = fieldSchema;
  const [value, setValue] = useState<any>(initialValues && _.isArray(initialValues)? initialValues : [])

  const getFields = ()=> {
    return _.map(subFields, (field:any, fieldName)=>{
      const fieldItemProps = {
        name: fieldName,
        objectApiName,
        fieldName: field.name,
        label: field.label,
        fieldSchema: field,
        required: field.required,
        readonly: field.readonly,
      };
      return (<ObjectField {...fieldItemProps} />)
    })
  }

  return (
    <BaseForm 
      // formFieldComponent = {ObjectField}
      className='object-form'
      initialValues={initialValues}
      // mode={mode}
      form={form}
      submitter={false}
      onValuesChange = {(changedValues:any, allValues:any)=>{
        if (onChange) onChange(allValues)
      }} 
      // layout={layout}
      // onFinish={onFinish}
    >
      {getFields()}
    </BaseForm>
  )
}

export const object = {
  render: (text: any, props: any) => {
    return (
        <FieldObject {...props} mode='read'/>
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
        <FieldObject {...props} mode='edit'/>
    )
  }
}