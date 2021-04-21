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
import { Objects, API } from "@steedos/builder-store"
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
    ...rest
  } = props

  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div>Loading object ...</div>)
  let columnFieldsArray = object.schema.list_views[listName];
  if (columnFields.length === 0) {
    _.forEach(columnFieldsArray.columns, (value) => {
      columnFields.push({ fieldName: value.field })
    })
  }
  filters = _.isFunction(columnFieldsArray.filters) ? columnFieldsArray.filters() : columnFieldsArray.filters;
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
