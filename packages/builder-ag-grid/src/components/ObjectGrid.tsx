import React, { useState } from "react"
import {forEach, compact, filter, keys} from "lodash"
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
import { Modal, Drawer, Button, Space } from 'antd';
import { AG_GRID_LOCALE_ZH_CN } from '../locales/locale.zh-CN'

export type ObjectGridColumnProps = {
  fieldName: string
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
  const filters = [];
  forEach(filterModel, (value, key)=>{
    if(value.filter){
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
  })
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
    ...rest
  } = props
  const [totalRecords, setTotalRecords] = useState(0)
  const [editedMap, setEditedMap] = useState({})
  const [drawerVisible, setDrawerVisible] = useState(false);
  // const [modal] = Modal.useModal();
  // const colSize = useAntdMediaQuery();
  // const isMobile = (colSize === 'sm' || colSize === 'xs') && !props.disableMobile;

  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div><Spin/></div>)

  const getDataSource = () => {
    return {
        // called by the grid when more rows are required
        getRows: params => {

            // // get data for request from server
            // const response = server.getData(params.request);

            // if (response.success) {
            //     // supply rows for requested block to grid
            //     params.success({
            //         rowData: response.rows
            //     });
            // } else {
            //     // inform grid request failed
            //     params.fail();
            // }
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
                current: params.request.startRow,
                sort,
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

    const columns:any[] = [{
      resizable: false,
      width: 35,
      maxWidth: 35,
      minWidth: 35,
      checkboxSelection: true,
      headerCheckboxSelection: true, //仅rowModelType等于Client-Side时才生效
      suppressMenu: true,
    }];
    forEach(columnFields, ({ fieldName, ...columnItem }: ObjectGridColumnProps) => {
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
      else {
        filter = 'AgGridCellFilter',
        filterParams = {
          fieldSchema: field,
          valueType: field.type,
          multiple: true
        }
      }
      columns.push({
        field: fieldName,
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
    console.log(`ObjectGrid columns`, columns);
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

  const onRowValueChanged = (params)=>{
    console.log(`onRowValueChanged params`, params)
  }


  const cancel = ()=>{
    // setDrawerVisible(false);
    (document.getElementsByClassName('ant-drawer-open')[0] as any).style.display='none'
    setEditedMap({})
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
        paginationPageSize={20}
        rowSelection={rowSelection}
        modules={AllModules}
        stopEditingWhenGridLosesFocus={false}
        serverSideDatasource={getDataSource()}
        serverSideStoreType={ServerSideStoreType.Partial}
        sideBar='filters'
        undoRedoCellEditing={true}
        onCellValueChanged={onCellValueChanged}
        onRowValueChanged={onRowValueChanged}
        context={{editedMap: editedMap}}
        frameworkComponents = {{
          AgGridCellRenderer: AgGridCellRenderer,
          AgGridCellEditor: AgGridCellEditor,
          AgGridCellFilter: AgGridCellFilter,
          rowActions: RowActions,
        }}
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
