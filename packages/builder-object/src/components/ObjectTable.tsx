import React, { useContext, useRef, useEffect, useState } from "react"
import _ from "lodash"
// import { BuilderStoreContext } from '@builder.io/react';
import { ObjectContext } from "../"
import { useQuery } from "react-query"
import ProTable, {
  ProTableProps,
  RequestData,
  ProColumnType,
} from "@ant-design/pro-table"
import { SortOrder } from "antd/lib/table/interface"
import { ParamsType } from "@ant-design/pro-provider"
import { observer } from "mobx-react-lite"
import { registerObjectTableComponent } from ".."
import { TableModel, store } from "@steedos/builder-store"
// import "./ObjectTable.less"
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

export type ObjectTableColumnProps = {
  fieldName: string
} & ProColumnType

export type ObjectTableProps<T extends ObjectTableColumnProps> =
  | ({
      name?: string
      objectApiName?: string
      columnFields?: T[]
      filters?: [] | string
      onChange?: ([any]) => void
      // filterableFields?: [string]
    } & {
      defaultClassName?: string
    })
  | any

export const getProColumnProps = (
  proColumnProps: any,
  fieldType: string,
  readonly: boolean,
  field: any
) => {
  switch (fieldType) {
    case "text":
      proColumnProps.valueType = "text"
      proColumnProps.readonly = readonly
      break
    case "password":
      proColumnProps.valueType = "password"
      proColumnProps.readonly = readonly
      break
    case "email":
      proColumnProps.valueType = "email"
      proColumnProps.readonly = readonly
      break
    case "percent":
      proColumnProps.valueType = "percent"
      proColumnProps.readonly = readonly
      break
    case "avatar":
      proColumnProps.valueType = "avatar"
      proColumnProps.readonly = readonly
      break
    case "select":
      proColumnProps.valueType = "select"
      proColumnProps.fieldProps.options = field.options
      proColumnProps.readonly = readonly
      break
    case "textarea":
      proColumnProps.valueType = "textarea"
      proColumnProps.hideInSearch = true
      proColumnProps.copyable = true
      proColumnProps.ellipsis = true
      proColumnProps.readonly = readonly
      break
    case "date":
      proColumnProps.valueType = "date"
      proColumnProps.readonly = readonly
      break
    case "datetime":
      proColumnProps.valueType = "dateTime"
      proColumnProps.readonly = readonly
      break
    case "boolean":
      proColumnProps.valueType = "switch"
      proColumnProps.hideInSearch = true
      proColumnProps.readonly = readonly
      break
    case "number":
      proColumnProps.valueType = "digit"
      proColumnProps.readonly = readonly
      break
    case "currency":
      proColumnProps.valueType = "money"
      proColumnProps.readonly = readonly
      break
    case "autonumber":
      proColumnProps.valueType = "index"
      proColumnProps.hideInSearch = true
      proColumnProps.readonly = readonly
      break
    case "url":
      proColumnProps.valueType = "href"
      break
    case "lookup":
      proColumnProps.render = () => (
        <div>{`未实现字段类型${fieldType}的组件`}</div>
      )
      break
    case "master_detail":
      proColumnProps.render = () => (
        <div>{`未实现字段类型${fieldType}的组件`}</div>
      )
      break
  }
  return proColumnProps
}

export const getObjectTableProColumn = (field: any) => {
  // 把yml中的某个字段field转成ant的ProTable中的columns属性项
  if (!field) {
    return null
  }

  const fieldType: string = field.type
  let proColumnProps: any = {
    title: field.label,
    dataIndex: field.name,
    formItemProps: {},
    fieldProps: {},
  }
  if (field.required) {
    proColumnProps.formItemProps.required = true
  }

  if (field.sortable) {
    proColumnProps.sorter = true
  }

  if (fieldType === "formula") {
    proColumnProps = getProColumnProps(
      proColumnProps,
      field.data_type,
      true,
      field
    )
  } else if (fieldType === "summary") {
    proColumnProps = getProColumnProps(
      proColumnProps,
      field.summary_type,
      true,
      field
    )
  } else {
    proColumnProps = getProColumnProps(
      proColumnProps,
      fieldType,
      field.readonly || false,
      field
    )
  }
  return proColumnProps
}

export const ObjectTable = observer((props: ObjectTableProps<any>) => {
  // export const ObjectTable = <T extends Record<string, any>, U extends ParamsType, ValueType>(props: ObjectTableProps<T, U, ValueType>) => {
  // const store = useContext(BuilderStoreContext);
  const objectContext = useContext(ObjectContext)
  let { currentObjectApiName } = store
  if (!currentObjectApiName) {
    currentObjectApiName = objectContext.currentObjectApiName
  }

  const {
    name: tableId = "default",
    objectApiName,
    columnFields = [],
    filters,
    defaultClassName,
    onChange,
    ...rest
  } = props

  if (!store.forms[tableId])
    store.forms[tableId] = TableModel.create({ id: tableId })
  const { isLoading, error, data, isFetching } = useQuery(
    objectApiName + "_schema",
    async () => {
      return await objectContext.requestObject(objectApiName as string)
    }
  )
  const objectSchema: any = data
  let [proColumns, setProColumns] = useState([])
  useEffect(() => {
    if (objectSchema) {
      let tmpProColumns = []
      registerObjectTableComponent(_.keys(objectSchema.fields))

      const objectFields = objectSchema.fields

      if (objectFields) {
        _.forEach(
          columnFields,
          ({ fieldName, ...columnItem }: ObjectTableColumnProps) => {
            if (columnItem.hideInTable) return
            const proColumn = getObjectTableProColumn(objectFields[fieldName])

            if (proColumn) {
              tmpProColumns.push({ ...proColumn, ...columnItem })
            }
          }
        )
      }
      setProColumns(tmpProColumns)
    }
  }, [objectSchema])

  const request = async (
    params: {
      pageSize?: number
      current?: number
      keyword?: string
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, React.ReactText[]>
  ): Promise<any> => {
    // 第一个参数 params 查询表单和 params 参数的结合
    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
    // 如果需要转化参数可以在这里进行修改
    /*
    const msg = await myQuery({
      page: params.current,
      pageSize: params.pageSize,
    });
    return {
      data: msg.result,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: boolean,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: number,
    };
    */

    const { current, pageSize, ...searchFilters } = params
    let tableFilters = Object.keys(searchFilters).map((key) => {
      return "contains(" + key + ",'" + searchFilters[key] + "')"
    })

    // TODO: 这里antd的request请求函数与ObjectTable组件传入的filters,sort等格式不一样，需要转换处理
    const fields = columnFields.map((n) => {
      return n.fieldName
    })
    console.log(
      [filters ? "(" + filters + ")" : "", ...tableFilters]
        .filter((a) => a)
        .join(" and ")
    )
    const result = await objectContext.requestRecords(
      objectApiName,
      [filters ? "(" + filters + ")" : "", ...tableFilters]
        .filter((a) => a)
        .join(" and "), //[filters, tableFilters].filter(a=>a).join(' and '),
      fields,
      {
        pageSize: params.pageSize as number,
        current: params.current as number,
        sort: sort,
      }
    )
    return {
      data: result.value,
      success: true,
      total: result["@odata.count"],
    }
  }

  return (
    <ProTable
      request={request}
      columns={proColumns}
      rowKey={rest.rowKey || "_id"}
      rowSelection={rest.rowSelection || { onChange }}
      pagination={{ ...rest.pagination, hideOnSinglePage: true }}
      options={false}
      {...rest}
      className={["object-table", rest.className].join(" ")}
    />
  )
})
