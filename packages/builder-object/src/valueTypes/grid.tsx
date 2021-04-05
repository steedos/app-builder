import { EditableProTable } from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import _ from 'lodash';
import React, { useState } from 'react';

// 表格类型字段，
// value格式：{ gridField: [{subField1: 666, subField2: 'yyy'}] }
// 编辑时调用 editable protable，要求行可拖拉调整顺序
// 显示时调用只读 protable
// props.fields [] 列数组
const TableField = (props) => {
  console.log(props)
  const {text =[], fieldSchema={}} = props;
  const {subFields=[]} = fieldSchema;
  const value = text && _.isArray(text)? text : [];
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    value.map((item) => item._id),
  );
  const columns = [];
  _.forEach(subFields, (field, fieldName)=>{
    columns.push({
      key: fieldName,
      dataIndex: fieldName,
      title: field.label?field.label:fieldName,
      valueType: field.type,
      editable: !field.readonly,
      hideInSearch: !field.filterable,
      hideInTable: field.hidden,
      hideInForm: field.hidden | field.omit,
    })
  });
  console.log(columns)

  return (
    <EditableProTable<any>
      rowKey="_id"
      toolBarRender={false}
      columns={columns}
      recordCreatorProps={{
        newRecordType: 'dataSource',
        position: 'top',
        record: () => ({
          _id: Date.now(),
        }),
      }}
      editable={{
        type: 'multiple',
        editableKeys,
        onChange: setEditableRowKeys,
        actionRender: (row, _, dom) => {
          return [dom.delete];
        },
      }}
    />
  )
}

export const grid = {
  render: (text: any, props: any) => {
    return (<div>调用 protable 的显示界面</div>)
  },
  renderFormItem: (_: any, props: any) => {
    const {text =[], fieldSchema={}} = props;
    const {label, name} = fieldSchema;
    return (
      // <ProForm.Item
      //   label={label}
      //   name={name}
      //   initialValue={text}
      //   trigger="onValuesChange"
      // >
        <TableField {...props}/>
      // </ProForm.Item>
    )
  }
}