import React, { useContext, useRef, useEffect, useState } from "react"
import { isFunction, forEach, isObject, filter, isString, each, includes, isBoolean, } from "lodash"
// import { ObjectExpandTable } from "./"
import { ObjectGrid as ObjectExpandTable } from '@steedos/builder-ag-grid';
import {
  ProColumnType
} from "@ant-design/pro-table"
import { observer } from "mobx-react-lite"
import { Objects, API, Settings } from "@steedos/builder-store"
import { Link } from "react-router-dom";
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

function getListViewFilters(listView, props){
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

function getListviewColumns(objectSchema: any, listName: any){
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

function getListViewColumnFields(listViewColumns: any, props: any, nameFieldKey: string){
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
  console.log(`objectSchema.actions`, objectSchema.actions)
  each(objectSchema.actions, function (action: any, actionApiName: string) {
    if (!includes(['record', 'record_more', 'list_item'], action.on)) {
      return;
    }
    let visible = false;
    if (isString(action._visible)) {
      try {
        const visibleFunction = eval(`(${action._visible})`);
        visible = visibleFunction(objectApiName)
      } catch (error) {
        // console.error(error, action._visible)
      }
    }
    if (isBoolean(action._visible)) {
      visible = action._visible
    }
    let todo = action._todo || action.todo;
    if (isString(todo) && todo.startsWith("function")) {
      try {
        todo = eval(`(${todo})`);
      } catch (error) {
        console.error(error, todo)
      }
    }
    buttons.push({label: action.label, todo: todo, visible: visible});
  });
  console.log(`buttons`, buttons)
  return buttons
}

export const ObjectListView = observer((props: ObjectListViewProps<any>) => {
  let {
    objectApiName,
    listName = "all",
    columnFields,
    filters,
    listSchema,
    ...rest
  } = props
  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div>Loading object ...</div>)
  const schema = object.schema; 
  let listView = listSchema ? listSchema : schema.list_views[listName];
  const listViewColumns = listSchema && listSchema.columns ? listSchema.columns : getListviewColumns(schema, listName);
  if(!columnFields || columnFields.length==0){
    columnFields = getListViewColumnFields(listViewColumns, props, schema.NAME_FIELD_KEY);
  }
  if(!filters || filters.length==0){
    filters = getListViewFilters(listView, props);
  }
  const rowButtons = getRowButtons(schema);

  return (
    <ObjectExpandTable
      objectApiName={objectApiName}
      columnFields={columnFields}
      filters={filters}
      rowButtons={rowButtons}
      // className={["object-listview", rest.className].join(" ")}
      {...rest}
    />
  )
})