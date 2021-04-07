import ProTable, { EditableProTable } from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';

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
  const {sub_fields=[]} = fieldSchema;
  const [value, setValue] = useState<any>(initialValue && _.isArray(initialValue)? initialValue : [])
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    value.map((item) => item._id),
  );

  const columns:any[] = [{
    title: '',
    dataIndex: 'sort',
    width: 30,
    className: 'drag-visible',
    render: () => <DragHandle />,
    renderFormItem: () => <span />,
  }];
  _.forEach(sub_fields, (field, fieldName)=>{
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
      width: 50,
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
  

  const TableSortableItem = SortableElement(props => <tr {...props} />);
  const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

  const onDragEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(value), oldIndex, newIndex).filter(el => !!el);
      console.log('Sorted items: ', newData);
      setValue(newData);
    }
    // TODO: 拖动结果需要单独出发 form 保存事件。
  };

  const TableSortableContainer = SortableContainer(props => <tbody {...props} />);
  const DraggableContainer = props => (
    <TableSortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onDragEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = value.findIndex(x => x._id === restProps['data-row-key']);
    return <TableSortableItem index={index} {...restProps} />;
  };

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
        size="small"
        rowKey="_id"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
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
        size="small"
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