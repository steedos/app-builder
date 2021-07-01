import React, { useState } from "react"
import { forEach, compact, filter, includes, keys, map, isEmpty, isFunction, isObject, uniq, find, sortBy, reverse, clone, isArray } from 'lodash';
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
import { AgGridCellTextFilter } from './CellTextFilter';
import { AgGridCellNumberFilter } from './CellNumberFilter';
import { Modal, Drawer, Button, Space } from 'antd';
import { AG_GRID_LOCALE_ZH_CN } from '../locales/locale.zh-CN'
import { Tables } from '@steedos/builder-store';

import './ObjectGrid.less'

export type ObjectGridColumnProps = {
  fieldName: string,
  hideInTable: boolean,
  hideInSearch: boolean,
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
      if(value.filterType === "number"){
        filters.push([key, "between", [value.numberFrom, value.numberTo]]);
      }else{
        if(value.filter){
          filters.push([key, value.type, value.filter]);
        }else{
          filters.push([key, "between", [value.dateFrom, value.dateTo]]);
        }
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
  // console.log(`filters`, filters)
  return filters;
}

export const ObjectGrid = observer((props: ObjectGridProps<any>) => {

  const {
    name = 'default',
    objectApiName,
    columnFields = [],
    extraColumnFields = [],
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
    onUpdated,
    checkboxSelection = true,
    pagination = true,
    selectedRowKeys,
    rowKey = '_id',
    objectSchema: defaultObjectSchema,
    rows,
    ...rest
  } = props;
  const table = Tables.loadById(name, objectApiName,rowKey);
  const [editedMap, setEditedMap] = useState({})
  // 将初始值存放到 stroe 中。
  if(selectedRowKeys && selectedRowKeys.length){
    table.addSelectedRowsByKeys(selectedRowKeys, columnFields, rows)
  }
  // const [drawerVisible, setDrawerVisible] = useState(false);
  // const [modal] = Modal.useModal();
  // const colSize = useAntdMediaQuery();
  // const isMobile = (colSize === 'sm' || colSize === 'xs') && !props.disableMobile;
  let sideBar = defaultSideBar;
  let _pageSize = pageSize;
  if(!pagination){
    _pageSize = 0;
  }
  if(isEmpty(sideBar) && sideBar !== false ){
    sideBar = {
      toolPanels:[
        {
          id: 'filters',
          labelKey: 'filters',
          labelDefault: 'Filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        }
      ]
    }
  }
  if(rows){
    sideBar = false;
  }
  const object = objectApiName && Objects.getObject(objectApiName);
  if (object && object.isLoading) return (<div><Spin/></div>)

  const objectSchema = defaultObjectSchema ? defaultObjectSchema : object.schema;

  const setSelectedRows = (params)=>{
      // 当前显示页中store中的初始值自动勾选。
      const selectedRowKeys = table.getSelectedRowKeys();
      if(selectedRowKeys && selectedRowKeys.length){
        const gridApi = params.api;
        gridApi.forEachNode(node => {
          if(node.data && node.data[rowKey]){
            if (selectedRowKeys.indexOf(node.data[rowKey])>-1) {
              node.setSelected(true);
            }else{
              node.setSelected(false);
            }
          }
        });
      }
  }

  const getDataSource = () => {
    return {
        getRows: params => {
          if(rows){
            const sort = []
            forEach(params.request.sortModel, (sortField)=>{
              sort.push([sortField.colId, sortField.sort])
            })
            let sortedRows = clone(rows);
            if(sort.length){
              sortedRows = sortBy(rows, [sort[0][0]]);
              if(sort[0][1] === "desc"){
                sortedRows = reverse(sortedRows)
              }
            }
            params.success({
              rowData: sortedRows,
              rowCount: rows.length
            });
            setSelectedRows(params);
          }
          else{
            let fields = ['name'];
            forEach(columnFields, ({ fieldName, ...columnItem }: ObjectGridColumnProps) => {
              fields.push(fieldName)
            });
            fields = uniq(compact(fields.concat(extraColumnFields).concat(["owner", "company_id", "company_ids", "locked"])));
            const sort = []
            forEach(params.request.sortModel, (sortField)=>{
              sort.push([sortField.colId, sortField.sort])
            })
            const filters = compact([].concat(defaultFilters).concat(filterModelToOdataFilters(params.request.filterModel)));
            // TODO 此处需要叠加处理 params.request.fieldModel
            let options: any = {
              sort,
              $top: pageSize,
              $skip: params.request.startRow
            };
            if(!pagination){
              options = {
                sort
              };
            }
            API.requestRecords(
              objectApiName,
              filters,
              fields,options).then((data)=>{
                params.success({
                  rowData: data.value,
                  rowCount: data['@odata.count']
                });
                setSelectedRows(params);
            })
          }
        }
    };
  }

  const getColumns = (rowButtons)=>{
    const width = checkboxSelection ? 80 : 50;
    const columns:any[] = [
      {
        resizable: false,
        pinned: "left",
        valueGetter: params => {
          return parseInt(params.node.id) + 1
        },
        width: width,
        maxWidth: width,
        minWidth: width,
        cellStyle: {"text-align": "right" },
        checkboxSelection: checkboxSelection,
        headerCheckboxSelection: checkboxSelection, //仅rowModelType等于Client-Side时才生效
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
    forEach(columnFields, ({ fieldName, hideInTable, hideInSearch, ...columnItem }: ObjectGridColumnProps) => {
      const field = objectSchema.fields[fieldName];
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
      if( hideInSearch ){
        filter = false;
      }
      else{
        if (["textarea", "text", "code"].includes(field.type)) {
          filter = 'AgGridCellTextFilter'
          filterParams = {
            fieldSchema: field,
            valueType: field.type
          }
        }
        else if (["number", "percent", "currency"].includes(field.type)) {
          filter = 'AgGridCellNumberFilter'
          filterParams = {
            fieldSchema: field,
            valueType: field.type
          }
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
      }
      let fieldSort = find(sort, (item)=>{
        return item.field_name === fieldName
      });

      let fieldWidth = (columnItem as any).width ? (columnItem as any).width : (field.is_wide ? 300 : 150);

      columns.push({
        field: fieldName,
        hide: hideInTable,
        headerName: field.label ? field.label:fieldName,
        width: fieldWidth,
        minWidth: fieldWidth ? fieldWidth : 60,
        resizable: true,
        filter,
        sort: fieldSort ? fieldSort.order : undefined,
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
        editable: (params)=>{
          return API.client.field.isEditable(objectApiName, params.colDef.filterParams.fieldSchema, params.data)
        }
      })
    });

    //处理filters depend_on  
    map(columns, (column)=>{
      if(column.filter === 'AgGridCellFilter' && isArray(column.filterParams.fieldSchema.depend_on)){
        map(filter(columns, (_column)=>{
          return includes(column.filterParams.fieldSchema.depend_on, _column.field)
        }), (__column)=>{
          if(__column.filterParams.fieldSchema && !isArray(__column.filterParams.depended)){
            __column.filterParams.depended = [];
          }
          __column.filterParams.depended.push(column.field)
        })
      }
    })

    if(rowButtons && isArray(rowButtons) && rowButtons.length > 0){
      // 操作按钮
      columns.push({
        width: 50,
        maxWidth: 50,
        minWidth: 50,
        resizable: false,
        pinned: "right",
        cellRenderer: 'rowActions',
        cellEditor: 'rowActions',
        suppressMenu: true,
        cellRendererParams: {
          objectApiName,
          rowButtons: rowButtons
        }
      });
    }
    return columns
  }

  const RowActions = (props: any) => {
    const {rowButtons, objectApiName, data} = props;
    const [options, setOptions] = useState([]);
    const getDropdownOptions = ()=>{
      const result = filter(rowButtons, (button)=>{
        return API.client.action.calculationVisible(objectApiName, button, data, {
          userId: API.client.getUserId(),
          spaceId: API.client.getSpaceId(),
        })
      });
      if(result.length){
        return result;
      }
      else{
        return [{ label: "没有可做的操作", todo: null, }];
      }
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
            if(!option || !option.todo){
              return;
            }
            API.client.action.executeAction(objectApiName, option, data._id, null, null, data)
          } catch (error) {
            console.error(`executeAction error`, error)
          }
        }}
        options={options}
        onOpen={() => {
          if(!options.length){
            const dropdownOptions = getDropdownOptions();
            setOptions(dropdownOptions);
          }
        }}
      />
    )
  }

  const onCellValueChanged = (params) => {
    // 这里赋值有延迟，转移到 CellEditor
    if(!editedMap[params.data._id]){
      editedMap[params.data._id] = {};
    }
    editedMap[params.data._id][params.colDef.field] = params.value;
    setTimeout(function(){
      // setDrawerVisible(true);
      (document.getElementsByClassName(`grid-action-drawer-${name}`)[0] as any).style.display=''
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
    // 多选时， 新增一个选项就增加到store中，删除一个就从store中删除。 单选就替换store中的值。
    if(rowSelection === 'multiple'){
      if(params.node){
        if(params.node.selected){
          table.addSelectedRows([params.node.data]);
        }else{
          table.removeSelectedRows([params.node.data]);
        }
      }
    }else{
      table.setSelectedRows(selectedRows);
    }
  }

  const onRowValueChanged = (params)=>{
    // console.log(`onRowValueChanged params`, params)
  }


  const cancel = ()=>{
    // setDrawerVisible(false);
    const editDrawerElement = (document.getElementsByClassName(`grid-action-drawer-${name}`)[0] as any);
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
    if(onUpdated && isFunction(onUpdated)){
      onUpdated(objectApiName, ids);
    }
    try {
      cancel();
    } catch (error) {
      
    }
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
        pagination={pagination}
        onSortChanged={onSortChanged}
        onFilterChanged={onFilterChanged}
        paginationPageSize={_pageSize}
        cacheBlockSize={_pageSize}
        rowSelection={rowSelection}
        enableRangeSelection={true}
        suppressCopyRowsToClipboard={true}
        modules={AllModules}
        stopEditingWhenGridLosesFocus={false}
        stopEditingWhenCellsLoseFocus={false}
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
          AgGridCellTextFilter: AgGridCellTextFilter,
          AgGridCellNumberFilter: AgGridCellNumberFilter,
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
        className={`grid-action-drawer-${name}`}
      >
        <Space>
          <Button onClick={cancel}>取消</Button>
          <Button onClick={updateMany} type="primary" >确定</Button>
        </Space>
      </Drawer>
    </div>
  )
})
