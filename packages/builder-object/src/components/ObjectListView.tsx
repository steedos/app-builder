import React, { useContext, useRef, useEffect, useState } from "react"
import { isFunction, forEach, isObject, filter, isString, each, includes, isBoolean, isArray } from 'lodash';
// import { ObjectExpandTable } from "./"
import { ObjectGrid as ObjectExpandTable } from '@steedos/builder-ag-grid';
import {
  ProColumnType
} from "@ant-design/pro-table"
import { observer } from "mobx-react-lite"
import { Objects, API, Settings } from "@steedos/builder-store"
import { Link } from "./Link";
import { getObjectRecordUrl } from "../utils"

export type ObjectListViewColumnProps = {
  fieldName: string
} & ProColumnType

export type ObjectListViewProps<T extends ObjectListViewColumnProps> =
  | ({
      name?: string
      objectApiName?: string
      listName?: string
      columnFields?: T[],
      filters?: [] | string
      onChange?: ([any]) => void
      // filterableFields?: [string]
    } & {
      defaultClassName?: string
    })
  | any

export const getObjectListViewProColumn = (field: any) => {
  // 把yml中的某个字段field转成ant的ProTable中的columns属性项
  if (!field) {
    return null
  }

  const fieldType: string = field.type
  let proColumnProps: any = {
    title: field.label,
    dataIndex: field.name,
    formItemProps: {},
    fieldProps: {
      field_schema: field
    },
  }
  if (field.required) {
    proColumnProps.formItemProps.required = true
  }

  if (field.sortable) {
    proColumnProps.sorter = {
        multiple: 1
    };
  }

  proColumnProps.valueType = fieldType
  
  return proColumnProps
}

export const getListViewFilters = (listView, props) => {
  let { filters, filter_scope, master } = props;
  if(!filters){
    filters = listView.filters;
  }
  if(isFunction(filters)){
    try {
      filters = filters()
    } catch (error) {
      console.warn(`list view filter error: `, error)
    }
  }
  filters = isFunction(filters) ? [] : filters;
  if(!filter_scope){
    filter_scope = listView.filter_scope;
  }
  if(filter_scope === "mine"){
    const filtersOwner=[["owner", "=", API.client.getUserId()]];
    if(filters && filters.length){
      filters = [filtersOwner, filters];
    }
    else{
      filters = filtersOwner;
    }
  }

  if(master){
    filters = [[master.relatedFieldApiName, "=", master.recordId], filters];
  }

  return filters;
}

export const getListviewColumns = (objectSchema: any, listName: any) => {
  let listView = objectSchema.list_views[listName];
  let listViewColumns = listView && listView.columns;
  if(!listViewColumns){
    listView = objectSchema.list_views.default;
    listViewColumns = listView && listView.columns;
    if(!listViewColumns){
      listViewColumns = [objectSchema.NAME_FIELD_KEY]
    }
  }
  return listViewColumns;
}

export const getListviewExtraColumns = (objectSchema: any, listName: any) => {
  let listView = objectSchema.list_views[listName];
  let listViewColumns = listView && listView.extra_columns;
  if(!listViewColumns){
    listView = objectSchema.list_views.default;
    listViewColumns = listView && listView.extra_columns;
    if(!listViewColumns){
      listViewColumns = [objectSchema.NAME_FIELD_KEY]
    }
  }
  return listViewColumns;
}

export const getListViewColumnFields = (listViewColumns: any, props: any, nameFieldKey: string) => {
  let { columnFields = [], master } = props;
  if (columnFields.length === 0) {
    forEach(listViewColumns, (column: any) => {
      const fieldName: string = isObject(column) ? (column as any).field : column;
      let columnOption: any = { fieldName };
      if(fieldName === nameFieldKey){
        columnOption.render = (dom: any, record: any)=>{
          return (<Link to={getObjectRecordUrl(props.objectApiName, record._id)} className="text-blue-600 hover:text-blue-500 hover:underline">{dom}</Link>);
        }
      }
      columnFields.push(columnOption)
    })
  }
  //作为相关表时，不显示关系键
  if(master){
    return filter(columnFields, (columnField)=>{
      if(isString(columnField)){
        return columnField != master.relatedFieldApiName
      }
      return columnField.fieldName != master.relatedFieldApiName
    })
  }
  return columnFields;
}

function getRowButtons(objectSchema) {
  let { name: objectApiName } = objectSchema
  const buttons: any[] = [];
  each(objectSchema.actions, function (action: any, actionApiName: string) {
    if (!includes(['record', 'record_more', 'list_item'], action.on)) {
      return;
    }
    let visible: any = false;
    if (isString(action._visible)) {
      try {
        const visibleFunction = eval(`(${action._visible.replaceAll("_.", "window._.")})`);
        visible = function(){ return visibleFunction.apply( this, arguments );};
      } catch (error) {
        console.error(error, action._visible)
      }
    }
    if (isBoolean(action._visible)) {
      visible = action._visible
    }
    if (isBoolean(action.visible)) {
      visible = action.visible
    }
    let todo = action._todo || action.todo;
    if (isString(todo) && todo.startsWith("function")) {
      try {
        todo = eval(`(${todo.replaceAll("_.", "window._.")})`);
      } catch (error) {
        console.error(error, todo)
      }
    }
    buttons.push(Object.assign({}, action, {label: action.label, todo: todo, visible: visible}));
  });
  return buttons
}

export const ObjectListView = observer((props: ObjectListViewProps<any>) => {
  let {
    objectApiName,
    listName = "all",
    columnFields,
    filters,
    listSchema,
    inReact,
    sort,
    ...rest
  } = props
  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div>Loading object ...</div>)
  const schema = object.schema; 
  let listView = listSchema ? listSchema : schema.list_views[listName];
  const listViewColumns = listSchema && listSchema.columns ? listSchema.columns : getListviewColumns(schema, listName);
  const listViewExtraColumns = listSchema && listSchema.extra_columns ? listSchema.extra_columns : getListviewExtraColumns(schema, listName);
  if(!columnFields || columnFields.length==0){
    columnFields = getListViewColumnFields(listViewColumns, props, schema.NAME_FIELD_KEY);
  }
  if(!filters || filters.length==0){
    filters = getListViewFilters(listView, props);
  }
  const rowButtons = getRowButtons(schema);
  if(!sort || sort.length == 0){
    sort = listView.sort
  }

  let pagination = true;
  if(schema.paging?.enabled === false ){
    pagination = false;
  }

  const _sort = [];

  if(sort){
    each(sort, (item)=>{
      if(isArray(item)){
        if(item.length === 1){
          _sort.push({field_name: item[0], order: 'asc'});
        }else if(item.length === 2){
          _sort.push({field_name: item[0], order: item[1]});
        }
      }else if(isObject(item)){
        _sort.push(item);
      }
    })
  }
  return (
    <ObjectExpandTable
      objectApiName={objectApiName}
      columnFields={columnFields}
      extraColumnFields={listViewExtraColumns}
      filters={filters}
      sort={_sort}
      rowButtons={rowButtons}
      pagination={pagination}
      // className={["object-listview", rest.className].join(" ")}
      {...rest}
    />
  )
})