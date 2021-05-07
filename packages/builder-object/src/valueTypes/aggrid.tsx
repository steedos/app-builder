import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import ProField from "@ant-design/pro-field";
import Dropdown from '@salesforce/design-system-react/components/menu-dropdown'; 
import Popover from '@salesforce/design-system-react/components/popover'; 

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
          return true;
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
            if (newValue?.currentTarget?.value)
              setValue(newValue?.currentTarget?.value)
            else
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

const RowActions = (props: any) => {
  return (
    <Dropdown
      assistiveText={{ icon: 'More Options' }}
      iconCategory="utility"
      iconName="down"
      iconVariant="border-filled"
      iconSize='x-small'
      menuPosition="overflowBoundaryElement"
      onSelect={(value) => {
        console.log('selected: ', value);
      }}
      options={[
        { label: 'Delete', value: 'delete' }
      ]}
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

  const columns:any[] = [{
    rowDrag: mode == 'edit',
    hide: !(mode == 'edit'),
    width: 30,
  }];
  _.forEach(sub_fields, (field, fieldName)=>{
    columns.push({
      field: fieldName,
      headerName: field.label?field.label:fieldName,
      width: field.is_wide? 300: 150,
      resizable: true,
      filter: true,
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
  // 操作按钮
  columns.push({
    hide: !(mode == 'edit'),
    width: 50,
    cellEditor: 'rowActions',
    cellRenderer: 'rowActions',
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
        columnDefs={columns}
        stopEditingWhenGridLosesFocus={true}
        onRowDragEnd={onRowDragEnd.bind(this)}
        onCellClicked={onCellClicked}
        suppressNoRowsOverlay={true}
        frameworkComponents = {{
          proFieldRenderer: ProFieldRenderer,
          proFieldEditor: ProFieldEditor,
          rowActions: RowActions,
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