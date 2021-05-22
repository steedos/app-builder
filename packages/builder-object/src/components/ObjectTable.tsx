import React, { useContext, useRef, useEffect, useState } from "react"
import { map, forEach, isArray, isEmpty} from "lodash"
import { formatFiltersToODataQuery } from '@steedos/filters';
import useAntdMediaQuery from 'use-media-antd-query';
import ProTable, {
  ProColumnType,
} from "@ant-design/pro-table"
import { SortOrder } from "antd/es/table/interface"
import { observer } from "mobx-react-lite"
import { Objects, API } from "@steedos/builder-store"
import { Spin } from 'antd';
import "./ObjectTable.less"
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
      sort?: [] | string
      onChange?: ([any]) => void
      // filterableFields?: [string]
    } & {
      defaultClassName?: string
    })
  | any

export const getObjectTableProColumn = (field: any, columnOption?: any) => {
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
    }
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

  if(columnOption){
    proColumnProps = Object.assign({}, proColumnProps, columnOption);
  }
  
  return proColumnProps
}

export const checkFieldTypeSupportBetweenQuery = (type: string)=> {
  return false;
  // return ["date", "datetime", "currency", "number"].includes(type);
}

export const getFieldDefaultOperation = (type: any)=>{
	if(type && checkFieldTypeSupportBetweenQuery(type)){
		return 'between';
  }
	else if(["textarea", "text", "code"].includes(type)){
		return 'contains'
  }
	else{
		return "="
  }
}

function getDefaultSortOrder(fieldName: any, sort:any){
  let sortDirection:any;
  let sortValue: any;
  if (sort) {
    if (typeof sort === 'string' && sort.length > 0) {
      let arr = [];
      arr = sort.split(',');
      sortValue = map(arr, (value, key) => {
        if (value.indexOf(' ')) {
          return arr[key] = value.split(' ');
        } else {
          return arr[key] = [value]
        }
      })
    } else {
      sortValue = sort;
    }
    if (sortValue.length > 0) {
      forEach(sortValue, (ele) => {
        if (ele[0] === fieldName) {
          sortDirection = ele[1] === 'desc' ? 'descend' : 'ascend';
        }
      })
    }
  }
  return sortDirection;
}

export const ObjectTable = observer((props: ObjectTableProps<any>) => {

  const {
    objectApiName,
    columnFields = [],
    filters: defaultFilters,
    sort,
    defaultClassName,
    onChange,
    toolbar,
    search,
    pagination,
    rowSelection,
    ...rest
  } = props
  
  const [totalRecords, setTotalRecords] = useState(0)
  // selectedRowKeys为了实现表格的默认选中值
  const [selectedRowKeys, setSelectedRowKeys] = useState(rowSelection && rowSelection.selectedRowKeys)

  const colSize = useAntdMediaQuery();
  const isMobile = (colSize === 'sm' || colSize === 'xs') && !props.disableMobile;

  const object = Objects.getObject(objectApiName);
  const selfTableRef = useRef(null)
  if (object.isLoading) return (<div><Spin/></div>)

  let defaultSort: any = {};
  const proColumns = []
  if (object.schema && object.schema.fields) {
    forEach(
      columnFields,
      ({ fieldName, ...columnItem }: ObjectTableColumnProps) => {
        // if (columnItem.hideInTable) return
        let columnOption: any = {};
        const defaultSortOrder = getDefaultSortOrder(fieldName,sort)
        if(defaultSortOrder){
          columnOption.defaultSortOrder = defaultSortOrder;
          defaultSort[fieldName] = defaultSortOrder;
        }
        const  proColumn = getObjectTableProColumn(object.schema.fields[fieldName], columnOption)
        if (proColumn) {
          proColumns.push({ ...proColumn, ...columnItem })
        }
      }
    )
  }

  const request = async (
    params: any & {
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
    let filters: any = [], keyFilters: any = [];
    //searchFilters中包括params中自定义参数及顶部搜索框字段参数，字段名不可能是__开头，所以params中自定义参数以__开头可区分它们
    const {__objectApiName, __columnFields, __defaultFilters, ...restFilters} = searchFilters;
    keyFilters = Object.keys(restFilters).map((key) => {
      const field = object.schema.fields[key];
      return [key, getFieldDefaultOperation(field && field.type), searchFilters[key]];
    });
    
    if (__defaultFilters && __defaultFilters.length) {
      if(keyFilters && keyFilters.length){
        if (isArray(__defaultFilters)) {
            filters = [__defaultFilters, keyFilters]
        }
        else {
            const odataKeyFilters = formatFiltersToODataQuery(keyFilters);
            filters = `(${__defaultFilters}) and (${odataKeyFilters})`;
        }
      }
      else{
        filters = __defaultFilters;
      }
    }
    else{
      filters = keyFilters;
    }

    // TODO: 这里antd的request请求函数与ObjectTable组件传入的filters,sort等格式不一样，需要转换处理
    const fields = __columnFields.map((n: any) => {
      return n.fieldName
    })
    // TODO: ant.design的bug（defaultSortOrder 和 sorter存在时sort没获取到设置的初始值），所以这里
    // 设置下sort的初始值， 后期修复这个bug后以下三行代码可以 删除。
    if(isEmpty(sort) && !isEmpty(defaultSort)){
      sort = defaultSort;
    }
    const result = await API.requestRecords(
      __objectApiName,
      filters,
      fields,
      {
        pageSize: params.pageSize as number,
        current: params.current as number,
        sort: sort
          ? Object.keys(sort).map((sk) => [
              sk,
              sort[sk] == "ascend" ? "asc" : "desc",
            ])
          : [],
      }
    )
    setTotalRecords(result["@odata.count"])
    return {
      data: result.value,
      success: true,
      total: result["@odata.count"],
    }
  }

  let searchOptions: any =  {
    filterType: 'light',
  }
  if(isMobile){
    searchOptions = false;
  }
  const proSearch = search || search === false ? search : searchOptions;

  let toolbarOptions: any =  {
    subTitle: `${totalRecords} 个项目`
  };
  if(isMobile){
    toolbarOptions.settings = false;
  }
  const proToolbar = Object.assign({}, toolbarOptions, toolbar);
  // 默认显示多选勾选框；可以设置 rest.rowSelection 为false，不显示单选和多选。
  // const rowSelectionOptions = rowSelection !== false && Object.assign({ onChange }, rowSelection);
  const rowSelectionOptions = rowSelection !== false && Object.assign({}, rowSelection, { 
    selectedRowKeys,
    onChange: (keys, rows) => {
      if (onChange) {
        onChange(keys, rows);
      }
      setSelectedRowKeys(keys);
    } 
  });

  return (
    <ProTable
      request={request}
      columns={proColumns}
      rowKey={rest.rowKey || "_id"}
      rowSelection={{...rowSelectionOptions}}
      pagination={{ ...pagination, hideOnSinglePage: true}}
      columnEmptyText={false}
      actionRef={rest.actionRef || selfTableRef}
      onChange={() => {
        ;(rest.actionRef || selfTableRef).current.reload()
      }}
      params={{
        __objectApiName: objectApiName,
        __columnFields: columnFields,
        __defaultFilters: defaultFilters,
      }}
      search={proSearch}
      toolbar={proToolbar}
      size="small"
      className={["object-table", rest.className].join(" ")}
      {...rest}
    />
  )
})
