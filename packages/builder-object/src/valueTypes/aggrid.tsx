import ProTable, { EditableProTable } from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import ProField from "@ant-design/pro-field";
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';

import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';

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
      fieldProps={{
        field_schema: fieldSchema
      }}
      text={value}
      emptyText=''
      />
  ) 
}

const ProFieldEditor = forwardRef((props: any, ref) => {
  const { 
    valueType = 'text',
    fieldSchema
  } = props;
  const [value, setValue] = useState(props.value);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
        getValue() {
            return value;
        },
        isPopup() {
          return false;
        }
    };
  });
  
  return (
    <section className="slds-popover slds-popover slds-popover_edit" role="dialog">
      <div className="slds-popover__body">
    <ProField 
      mode='edit'
      valueType={valueType} 
      value={value}
      onChange={(newValue)=>{
        setValue(newValue)
      }}
      fieldProps={{
        field_schema: fieldSchema
      }}
      />
      </div>
    </section>
  ) 
});

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

  const columns:any[] = [{
    rowDrag: mode == 'edit',
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

  const onCellClicked = ($event) => {
    if (mode == 'read')
      return;
    $event.api.startEditingCell({
      rowIndex: $event.rowIndex,
      colKey: $event.column.colId
    });
  };

  const onRowDragEnd = (e) => {
    var rowData = [];
    e.api.forEachNode(function (node) {
      rowData.push(node.data);
    });
    onChange(rowData)
  };

  return (
    <div className="ag-theme-balham steedos-grid">
      <AgGridReact
        rowDragManaged={true}
        animateRows={true}
        rowData={value}
        rowHeight={32}
        columnDefs={columns}
        stopEditingWhenGridLosesFocus={true}
        onRowDragEnd={onRowDragEnd.bind(this)}
        onCellClicked={onCellClicked}
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