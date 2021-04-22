import React, { useContext, useRef, useEffect, useState } from "react"
import _ from "lodash"
import { ObjectTable } from "./"
import { useQuery } from "react-query"
import ProTable, {
  ProTableProps,
  RequestData,
  ProColumnType,
} from "@ant-design/pro-table"
import { SortOrder } from "antd/lib/table/interface"
import { observer } from "mobx-react-lite"
import { Objects, API, Settings } from "@steedos/builder-store"
// export type TableProps<T extends Record<string, any>, U extends ParamsType, ValueType>  = {
//   mode?: ProFieldFCMode,
//   editable?: boolean,
// } & ProTableProps<T, U, ValueType> & {
//   defaultClassName: string;
// }

// export type ObjectTableProps = {
//   objectApiName?: string,
//   recordId?: string,
// } & ProTableProps<T, U, ValueType> & {
//   defaultClassName: string;
// }

export type ObjectListViewColumnProps = {
  fieldName: string
} & ProColumnType

export type ObjectListViewProps<T extends ObjectListViewColumnProps> =
  | ({
      name?: string
      objectApiName?: string
      listName?: string
      columnFields?: T[]
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

export const ObjectListView = observer((props: ObjectListViewProps<any>) => {

  let {
    objectApiName,
    listName = "all",
    columnFields = [],
    filters,
    filter_scope,
    ...rest
  } = props

  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div>Loading object ...</div>)
  let listView = object.schema.list_views[listName];
  if (columnFields.length === 0) {
    _.forEach(listView.columns, (column: any) => {
      const fieldName: string = _.isObject(column) ? (column as any).field : column;
      columnFields.push({ fieldName: fieldName })
    })
  }
  if(!filters){
    filters = listView.filters;
  }

  // filters为function的情况先不处理（因为filters中可能调用Creator，Steedos等全局变量），按空值返回
  // filters = _.isFunction(filters) ? filters() : filters;
  filters = _.isFunction(filters) ? [] : filters;
  if(!filter_scope){
    filter_scope = listView.filter_scope;
  }
  if(filter_scope === "mine"){
    const filtersOwner=[["owner", "=", Settings.userId]];
    if(filters && filters.length){
      filters = [filtersOwner, filters];
    }
    else{
      filters = filtersOwner;
    }
  }
  return (
    <ObjectTable
      objectApiName={objectApiName}
      columnFields={columnFields}
      filters={filters}
      className={["object-listview", rest.className].join(" ")}
      {...rest}
    />
  )
})