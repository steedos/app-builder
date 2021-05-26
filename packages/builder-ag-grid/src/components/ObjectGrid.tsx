import React, { useState } from "react"
import {forEach, compact, filter} from "lodash"
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
import { Modal } from 'antd';

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
    ...rest
  } = props
  const [totalRecords, setTotalRecords] = useState(0)
  const [modal] = Modal.useModal();
  const colSize = useAntdMediaQuery();
  const isMobile = (colSize === 'sm' || colSize === 'xs') && !props.disableMobile;

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
            console.log(params)
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
      headerCheckboxSelection: true,
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

  return (

    <div className="ag-theme-balham" style={{height: 500}}>
      <AgGridReact
        columnDefs={getColumns(rowButtons)}
        rowModelType='serverSide'
        pagination={true}
        paginationPageSize={50}
        rowSelection='multiple'
        modules={AllModules}
        stopEditingWhenGridLosesFocus={false}
        serverSideDatasource={getDataSource()}
        serverSideStoreType={ServerSideStoreType.Partial}
        sideBar='filters'
        frameworkComponents = {{
          AgGridCellRenderer: AgGridCellRenderer,
          AgGridCellEditor: AgGridCellEditor,
          AgGridCellFilter: AgGridCellFilter,
          rowActions: RowActions,
        }}
      />
    </div>
  )
})
