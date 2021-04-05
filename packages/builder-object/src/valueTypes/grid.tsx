import ProTable, { EditableProTable } from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import _ from 'lodash';
import React, { useState } from 'react';

// 表格类型字段，
// value格式：{ gridField: [{subField1: 666, subField2: 'yyy'}] }
// 编辑时调用 editable protable，要求行可拖拉调整顺序
// 显示时调用只读 protable
// props.fields [] 列数组
const TableField = (props, mode) => {
  
  const {text =[], fieldSchema={}, fieldProps={}} = props;
  const {value:initialValue, onChange} = fieldProps;
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
  
  const editable = {
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
        value={value}
        rowKey="_id"
        toolBarRender={false}
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
          position: 'top',
          record: () => ({
            _id: Date.now(),
          }),
        }}
        editable={editable}
      />
  )
}

export const grid = {
  render: (text: any, props: any) => {
    return (
        <TableField {...props} mode='read'/>
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
        <TableField {...props} mode='edit'/>
    )
  }
}