import React, { useState } from "react"
import {forEach, compact, filter, keys, map, isEmpty, isString, isObject} from "lodash"
import useAntdMediaQuery from 'use-media-antd-query';
import { observer } from "mobx-react-lite"
import { Objects, API } from "@steedos/builder-store"
import { Spin } from 'antd';
import {AgGridColumn, AgGridReact} from '@ag-grid-community/react';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { ServerSideStoreType } from '@ag-grid-enterprise/all-modules';
import Dropdown from '@salesforce/design-system-react/components/menu-dropdown'; 
import { AgGridCellEditor } from "./CellEditor";
import { AgGridCellRenderer } from "./CellRender";
import { AgGridCellFilter } from "./CellFilter";
import { AgGridCellDateFilter } from './CellDateFilter';
import { Modal, Drawer, Button, Space } from 'antd';
import { AG_GRID_LOCALE_ZH_CN } from '../locales/locale.zh-CN'

export type ObjectGridColumnProps = {
  fieldName: string,
  hideInTable: boolean
} 

export type ObjectGridProps<T extends ObjectGridColumnProps> =
  | ({
      name?: string
      objectApiName?: string
      columnFields?: T[]
      filters?: [] | string
      sort?: [] | string
      onChange?: ([any]) => void
      // filterableFields?: [string]
    } & {
      defaultClassName?: string
    })
  | any

const FilterTypesMap = {
  'equals': '=',
  'notEqual': '!=',
  'contains': 'contains',
  'notContains': 'notcontains',
  'startsWith': 'startswith',
  'endsWith': '=', //TODO 不支持
  'lessThan': '<',
  'lessThanOrEqual': '<=',
  'greaterThan': '>',
  'greaterThanOrEqual': '>=',
  'empty': 'empty' //TODO 不支持
}

/**
 * 
 * @param filterModel 
 */

const filterModelToOdataFilters = (filterModel)=>{
  // console.log(`filterModelToOdataFilters filterModel`, filterModel);
  const filters = [];
  forEach(filterModel, (value, key)=>{
    if(value.type === 'between'){
      if(value.filter){
        filters.push([key, value.type, value.filter]);
      }else{
        filters.push([key, "between", [value.dateFrom, value.dateTo]]);
      }
    }else{
      if(!isEmpty(value.filter)){
        const filter = [key, FilterTypesMap[value.type], value.filter];
        filters.push(filter);
      }else if(value.operator){
        const filter = [];
        if(value.condition1){
          filter.push([key, FilterTypesMap[value.condition1.type], value.condition1.filter]);
        }
        filter.push(value.operator.toLocaleLowerCase());
        if(value.condition2){
          filter.push([key, FilterTypesMap[value.condition2.type], value.condition2.filter]);
        }
        filters.push(filter);
      }
    }
  })
  console.log(`filters`, filters)
  return filters;
}

export const ObjectGrid = observer((props: ObjectGridProps<any>) => {

  const {
    objectApiName,
    columnFields = [],
    filters: defaultFilters,
    sort,
    defaultClassName,
    onChange,
    toolbar,
    rowButtons,
    rowSelection = 'multiple',
    sideBar: defaultSideBar,
    pageSize = 20,
    gridRef,
    onModelUpdated,
    ...rest
  } = props
  const [totalRecords, setTotalRecords] = useState(0)
  const [editedMap, setEditedMap] = useState({})
  // const [drawerVisible, setDrawerVisible] = useState(false);
  // const [modal] = Modal.useModal();
  // const colSize = useAntdMediaQuery();
  // const isMobile = (colSize === 'sm' || colSize === 'xs') && !props.disableMobile;
  let sideBar = defaultSideBar;
  if(!sideBar || isObject(sideBar)){
    sideBar = Object.assign({
      toolPanels:[
        {
          id: 'filters',
          labelDefault: '过滤',
          // labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        }
      ]
      // defaultToolPanel: 'filters',
    }, sideBar)
  }
  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div><Spin/></div>)

  const getDataSource = () => {
    return {
        getRows: params => {
            const fields = ['name']
            forEach(columnFields, ({ fieldName, ...columnItem }: ObjectGridColumnProps) => {
              fields.push(fieldName)
            });
            const sort = []
            forEach(params.request.sortModel, (sortField)=>{
              sort.push([sortField.colId, sortField.sort])
            })
            const filters = compact([].concat(defaultFilters).concat(filterModelToOdataFilters(params.request.filterModel)));
            // TODO 此处需要叠加处理 params.request.fieldModel
            API.requestRecords(
              objectApiName,
              filters,
              fields,{
                sort,
                $top: pageSize,
                $skip: params.request.startRow
              }).then((data)=>{

                params.success({
                  rowData: data.value,
                  rowCount: data['@odata.count']
                });
            })
        }
    };
  }

  const getColumns = (rowButtons)=>{

    const columns:any[] = [
      {
        resizable: false,
        pinned: "left",
        valueGetter: params => {
          return parseInt(params.node.id) + 1
        },
        width: 80,
        maxWidth: 80,
        minWidth: 80,
        cellStyle: {"text-align": "right" },
        checkboxSelection: true,
        headerCheckboxSelection: true, //仅rowModelType等于Client-Side时才生效
        suppressMenu: true,
      },
      // {
      //   resizable: false,
      //   pinned: "left",
      //   width: 35,
      //   maxWidth: 35,
      //   minWidth: 35,
      // }
    ];
    forEach(columnFields, ({ fieldName, hideInTable, ...columnItem }: ObjectGridColumnProps) => {
      const field = object.schema.fields[fieldName];
      if(!field){
        return ;
      }
      let fieldRender = null;
      if((columnItem as any).render){
        fieldRender = (columnItem as any).render
      }
      let filter:any = true
      let filterParams:any = {}
      let rowGroup = false //["select", "lookup"].includes(field.type)
      if (["textarea", "text", "code"].includes(field.type)) {
        filter = 'agTextColumnFilter'
      }
      else if (["number", "percent", "currency"].includes(field.type)) {
        filter = 'agNumberColumnFilter'
      }
      else if (["date", "datetime"].includes(field.type)) {
        filter = 'AgGridCellDateFilter'
        filterParams = {
          fieldSchema: field,
          valueType: field.type
        }
      }
      else {
        filter = 'AgGridCellFilter',
        filterParams = {
          fieldSchema: field,
          valueType: field.type
        }
      }
      columns.push({
        field: fieldName,
        hide: hideInTable,
        headerName: field.label?field.label:fieldName,
        width: field.is_wide? 300: 150,
        minWidth: field.is_wide? 300: 150,
        resizable: true,
        filter,
        filterParams,
        rowGroup,
        flex: 1,
        sortable: true,
        cellRenderer: 'AgGridCellRenderer',
        // cellClassRules: {
        //   "slds-is-edited": (params) => {
        //     const editedMap: any= params.colDef.editedMap
        //     if(editedMap){
        //       return editedMap[params.data._id]?.isEdited
        //     }
        //   }
        // },
        cellRendererParams: {
          fieldSchema: field,
          valueType: field.type,
          render: fieldRender
        },
        cellEditor: 'AgGridCellEditor',
        cellEditorParams: {
          fieldSchema: field,
          valueType: field.type,
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
      width: 50,
      maxWidth: 50,
      minWidth: 50,
      resizable: false,
      cellRenderer: 'rowActions',
      cellEditor: 'rowActions',
      suppressMenu: true,
      cellRendererParams: {
        objectApiName,
        rowButtons: rowButtons
      }
    });
    return columns
  }

  const RowActions = (props: any) => {
    const {rowButtons, objectApiName, data} = props;
    
    const dropdownOptions = filter(rowButtons, (button)=>{
      return API.client.action.calculationVisible(objectApiName, button, data, {
        userId: API.client.getUserId(),
        spaceId: API.client.getSpaceId(),
      })
    })

    if(dropdownOptions.length < 1){
      return (<></>)
    }

    return (
      <Dropdown
        assistiveText={{ icon: 'Options' }}
        iconCategory="utility"
        iconName="down"
        iconVariant="border-filled"
        iconSize='x-small'
        width='x-small'
        menuPosition="overflowBoundaryElement"
        onSelect={(option) => {
          try {
            API.client.action.executeAction(objectApiName, option, data._id, null, null, data)
          } catch (error) {
            console.error(`executeAction error`, error)
          }
        }}
        options={dropdownOptions}
      />
    )
  }

  const onCellValueChanged = (params) => {
    if(!editedMap[params.data._id]){
      editedMap[params.data._id] = {};
    }
    editedMap[params.data._id][params.colDef.field] = params.value;
    setTimeout(function(){
      // setDrawerVisible(true);
      (document.getElementsByClassName('ant-drawer-open')[0] as any).style.display=''
    }, 300)
    // if(!params.colDef.editedMap){
    //   params.colDef.editedMap = {};
    // }
    // params.colDef.editedMap[params.data._id] = {
    //   isEdited: true
    // }
  };
  const onRowSelected = (params) => {
    const selectedRows = params.api.getSelectedRows();
    if (onChange) {
      onChange(selectedRows)
    }
  }
  const onRowValueChanged = (params)=>{
    console.log(`onRowValueChanged params`, params)
  }


  const cancel = ()=>{
    // setDrawerVisible(false);
    const editDrawerElement = (document.getElementsByClassName('ant-drawer-open')[0] as any);
    if(editDrawerElement.style.display != 'none'){
      editDrawerElement.style.display='none'
      setEditedMap({})
    }
  }

  const onSortChanged = async (event)=>{
    cancel();
  }

  const onFilterChanged = async (event)=>{
    cancel();
  }

  const updateMany = async ()=>{
    // result = await API.updateRecord(objectApiName, recordId, values);
    const ids = keys(editedMap);
    for await (const id of ids) {
      await API.updateRecord(objectApiName, id, editedMap[id]);
    }
    cancel();
  }

  // const modelUpdated = (event)=>{
  //   console.log(`modelUpdated event getDisplayedRowCount`, event.api.getDisplayedRowCount())
  // }

  return (

    <div className="ag-theme-balham" style={{height: "100%", flex: "1 1 auto",overflow:"hidden"}}>
      <AgGridReact
        columnDefs={getColumns(rowButtons)}
        paginationAutoPageSize={false}
        localeText={AG_GRID_LOCALE_ZH_CN}
        rowModelType='serverSide'
        pagination={true}
        onSortChanged={onSortChanged}
        onFilterChanged={onFilterChanged}
        paginationPageSize={pageSize}
        cacheBlockSize={pageSize}
        rowSelection={rowSelection}
        modules={AllModules}
        stopEditingWhenGridLosesFocus={false}
        serverSideDatasource={getDataSource()}
        onModelUpdated={onModelUpdated}
        serverSideStoreType={ServerSideStoreType.Partial}
        sideBar={sideBar}
        undoRedoCellEditing={true}
        onCellValueChanged={onCellValueChanged}
        onRowValueChanged={onRowValueChanged}
        onRowSelected={onRowSelected}
        context={{editedMap: editedMap}}
        frameworkComponents = {{
          AgGridCellRenderer: AgGridCellRenderer,
          AgGridCellEditor: AgGridCellEditor,
          AgGridCellFilter: AgGridCellFilter,
          AgGridCellDateFilter: AgGridCellDateFilter,
          rowActions: RowActions,
        }}
        ref={gridRef}
      />
      <Drawer
        placement={"bottom"}
        closable={false}
        visible={true}
        mask={false}
        maskClosable={false}
        style={{height: "60px", display: "none"}}
        bodyStyle={{padding: "12px", textAlign: "center"}}
      >
        <Space>
          <Button onClick={cancel}>取消</Button>
          <Button onClick={updateMany} type="primary" >确定</Button>
        </Space>
      </Drawer>
    </div>
  )
})
