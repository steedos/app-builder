import ProTable, { EditableProTable } from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import React, { useState } from 'react';

// 表格类型字段，
// value格式：{ gridField: [{subField1: 666, subField2: 'yyy'}] }
// 编辑时调用 editable protable，要求行可拖拉调整顺序
// 显示时调用只读 protable
// props.fields [] 列数组
export const ObjectFieldGrid = (props) => {
  
  const {mode='read', text =[], fieldSchema={}, fieldProps={}} = props;
  const {value:initialValue, onChange} = fieldProps;
  
  _.forEach(initialValue, (row)=>{
    if (!row._id)
      row._id=uuidv4()
  })
  const {subFields=[]} = fieldSchema;
  const [value, setValue] = useState<any>(initialValue && _.isArray(initialValue)? initialValue : [])
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
  if (mode == 'edit'){
    columns.push({
      title: '',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="delete"
          onClick={() => {
            setValue(value.filter((item) => item._id !== record._id));
          }}
        >
          删除
        </a>,
      ],
    })
  }
  
  const editable: any = {
    type: 'multiple',
    editableKeys,
    onChange: setEditableRowKeys,
    actionRender: (row, _, dom) => {
      return [dom.delete];
    },
  };

  if (mode=='read')
    return (
      <ProTable<any>
        search={false}
        defaultData={value}
        rowKey="_id"
        toolBarRender={false}
        pagination={false}
        columns={columns}
      />
    )
  else
    return (
      <EditableProTable<any>
        value={value}
        onValuesChange={(value)=>{
          onChange?.(value);
          setValue(value)
        }}
        rowKey="_id"
        toolBarRender={false}
        columns={columns}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            _id: uuidv4(),
          }),
        }}
        editable={editable}
      />
  )
}

export const grid = {
  render: (text: any, props: any) => {
    return (
        <ObjectFieldGrid {...props} mode='read'/>
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
        <ObjectFieldGrid {...props} mode='edit'/>
    )
  }
}