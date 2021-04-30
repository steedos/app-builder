import ProTable, { EditableProTable } from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import ProField from "@ant-design/pro-field";
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';

import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import React, { useState, useRef } from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import './aggrid.less';

const ProFieldRenderer = (props: any) => {
  const { 
    value, 
    valueType = 'text',
    fieldSchema,
  } = props;
  return (
    <ProField 
      mode='read'
      valueType={valueType} 
      fieldSchema={fieldSchema}
      text={value}
      />
  ) 
}

const ProFieldEditor = (props: any) => {
  const { 
    value, 
    valueType = 'text',
    fieldSchema
  } = props;
  return (
    <ProField 
      mode='edit'
      valueType={valueType} 
      fieldSchema={fieldSchema}
      text={value}
      />
  ) 
}
// 表格类型字段，
// value格式：{ gridField: [{subField1: 666, subField2: 'yyy'}] }
// 编辑时调用 editable protable，要求行可拖拉调整顺序
// 显示时调用只读 protable
// props.fields [] 列数组
export const ObjectFieldGrid = (props) => {
  
  const {mode='read', text =[], fieldProps={}} = props;
  const { field_schema: fieldSchema = {}, depend_field_values: dependFieldValues={}, value:initialValue, onChange } = fieldProps;
  
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
    rowDrag: true,
    width: 30,
  }];
  _.forEach(sub_fields, (field, fieldName)=>{
    columns.push({
      field: fieldName,
      headerName: field.label?field.label:fieldName,
      width: field.is_wide? 300: 150,
      resizable: true,
      cellRenderer: 'proFieldRenderer',
      cellRendererParams: {
        fieldSchema: field,
        valueType: field.type,
        mode
      },
      cellEditor: 'proFieldEditor',
      cellEditorParams: {
        fieldSchema: field,
        valueType: field.type,
        mode,
      },
      // key: fieldName,
      // dataIndex: fieldName,
      // title: field.label?field.label:fieldName,
      // valueType: field.type,
      editable: !field.readonly,
    })
  });
  // if (mode == 'edit'){
  //   columns.push({
  //     title: '',
  //     valueType: 'option',
  //     width: 50,
  //     render: (text, record, _, action) => [
  //       <a
  //         key="delete"
  //         onClick={() => {
  //           setValue(value.filter((item) => item._id !== record._id));
  //         }}
  //       >
  //         删除
  //       </a>,
  //     ],
  //   })
  // }
  

  const TableSortableItem = SortableElement(props => <tr {...props} />);
  const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

  const onDragEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(value), oldIndex, newIndex).filter(el => !!el);
      onChange?.(newData);
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

  return (
    <div className="ag-theme-balham">
      <AgGridReact
        rowDragManaged={true}
        animateRows={true}
        rowData={value}
        columnDefs={columns}
        frameworkComponents = {{
          proFieldRenderer: ProFieldRenderer,
          proFieldEditor: ProFieldEditor,
        }}
      />
    </div>
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