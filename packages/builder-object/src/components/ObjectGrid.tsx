import React, { useContext, useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"
import _ from "lodash"
import ProField from "@ant-design/pro-field";
import { formatFiltersToODataQuery } from '@steedos/filters';
import useAntdMediaQuery from 'use-media-antd-query';
import { SortOrder } from "antd/lib/table/interface"
import { ParamsType } from "@ant-design/pro-provider"
import { observer } from "mobx-react-lite"
import { Objects, API } from "@steedos/builder-store"
import { getObjectRecordUrl } from "../utils"
import { Spin } from 'antd';
import {AgGridColumn, AgGridReact} from '@ag-grid-community/react';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import Dropdown from '@salesforce/design-system-react/components/menu-dropdown'; 
import Button from '@salesforce/design-system-react/components/button'; 

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

const ProFieldRenderer = (props: any) => {
  const { 
    value, 
    valueType = 'text',
    fieldSchema,
  } = props;
  return (
    
    <ProField 
      mode='read'
      valueType={valueType} 
      fieldProps={{
        field_schema: fieldSchema
      }}
      text={value}
      emptyText=''
      />
  ) 
}

const ProFieldEditor = forwardRef((props: any, ref) => {
  const { 
    valueType = 'text',
    fieldSchema
  } = props;
  const [value, setValue] = useState(props.value);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
        getValue() {
            return value;
        },
        isPopup() {
          return true;
        }
    };
  });
  
  return (
    <section className="slds-popover slds-popover slds-popover_edit" role="dialog">
      <div className="slds-popover__body">
        <ProField 
          mode='edit'
          valueType={valueType} 
          value={value}
          onChange={(newValue)=>{
            if (newValue?.currentTarget?.value)
              setValue(newValue?.currentTarget?.value)
            else
              setValue(newValue)
          }}
          fieldProps={{
            field_schema: fieldSchema
          }}
          />
      </div>
    </section>
  ) 
});
  
// export const getObjectGridProColumn = (field: any, columnOption?: any) => {
//   // 把yml中的某个字段field转成ant的ProTable中的columns属性项
//   if (!field) {
//     return null
//   }

//   const fieldType: string = field.type
//   let proColumnProps: any = {
//     title: field.label,
//     dataIndex: field.name,
//     formItemProps: {},
//     fieldProps: {
//       field_schema: field
//     }
//   }
//   if (field.required) {
//     proColumnProps.formItemProps.required = true
//   }

//   if (field.sortable) {
//     proColumnProps.sorter = {
//         multiple: 1
//     };
//   }

//   proColumnProps.valueType = fieldType

//   if(columnOption){
//     proColumnProps = Object.assign({}, proColumnProps, columnOption);
//   }
  
//   return proColumnProps
// }

const checkFieldTypeSupportBetweenQuery = (type: string)=> {
  return false;
  // return ["date", "datetime", "currency", "number"].includes(type);
}

const getFieldDefaultOperation = (type: any)=>{
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
      sortValue = _.map(arr, (value, key) => {
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
      _.forEach(sortValue, (ele) => {
        if (ele[0] === fieldName) {
          sortDirection = ele[1] === 'desc' ? 'descend' : 'ascend';
        }
      })
    }
  }
  return sortDirection;
}


const RowActions = (props: any) => {
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
        if (option.value === 'delete') {
          // deleteRow(props)
        }
      }}
      options={[
        { label: '删除', value: 'delete' }
      ]}
    />
  )
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
    ...rest
  } = props

  const [totalRecords, setTotalRecords] = useState(0)

  const colSize = useAntdMediaQuery();
  const isMobile = (colSize === 'sm' || colSize === 'xs') && !props.disableMobile;

  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div><Spin/></div>)
  // const selfTableRef = useRef(null)

  // let defaultSort: any = {};
  // const proColumns = []
  // if (object.schema && object.schema.fields) {
  //   _.forEach(
  //     columnFields,
  //     ({ fieldName, ...columnItem }: ObjectGridColumnProps) => {
  //       if (columnItem.hideInTable) return
  //       let columnOption: any = {};
  //       const defaultSortOrder = getDefaultSortOrder(fieldName,sort)
  //       if(defaultSortOrder){
  //         columnOption.defaultSortOrder = defaultSortOrder;
  //         defaultSort[fieldName] = defaultSortOrder;
  //       }
  //       const  proColumn = getObjectGridProColumn(object.schema.fields[fieldName], columnOption)
  //       if (proColumn) {
  //         proColumns.push({ ...proColumn, ...columnItem })
  //       }
  //     }
  //   )
  // }

// const request = async (
//     params: any & {
//       pageSize?: number
//       current?: number
//       keyword?: string
//     },
//     sort: Record<string, SortOrder>,
//     filter: Record<string, React.ReactText[]>
//   ): Promise<any> => {

//     // 第一个参数 params 查询表单和 params 参数的结合
//     // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
//     // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
//     // 如果需要转化参数可以在这里进行修改
//     /*
//     const msg = await myQuery({
//       page: params.current,
//       pageSize: params.pageSize,
//     });
//     return {
//       data: msg.result,
//       // success 请返回 true，
//       // 不然 table 会停止解析数据，即使有数据
//       success: boolean,
//       // 不传会使用 data 的长度，如果是分页一定要传
//       total: number,
//     };
//     */

//     const { current, pageSize, ...searchFilters } = params
//     let filters: any = [], keyFilters: any = [];
//     //searchFilters中包括params中自定义参数及顶部搜索框字段参数，字段名不可能是__开头，所以params中自定义参数以__开头可区分它们
//     const {__objectApiName, __columnFields, __defaultFilters, ...restFilters} = searchFilters;
//     keyFilters = Object.keys(restFilters).map((key) => {
//       const field = object.schema.fields[key];
//       return [key, getFieldDefaultOperation(field && field.type), searchFilters[key]];
//     });
    
//     if (__defaultFilters && __defaultFilters.length) {
//       if(keyFilters && keyFilters.length){
//         if (_.isArray(__defaultFilters)) {
//             filters = [__defaultFilters, keyFilters]
//         }
//         else {
//             const odataKeyFilters = formatFiltersToODataQuery(keyFilters);
//             filters = `(${__defaultFilters}) and (${odataKeyFilters})`;
//         }
//       }
//       else{
//         filters = __defaultFilters;
//       }
//     }
//     else{
//       filters = keyFilters;
//     }

//     // TODO: 这里antd的request请求函数与ObjectGrid组件传入的filters,sort等格式不一样，需要转换处理
//     const fields = __columnFields.map((n: any) => {
//       return n.fieldName
//     })
//     // TODO: ant.design的bug（defaultSortOrder 和 sorter存在时sort没获取到设置的初始值），所以这里
//     // 设置下sort的初始值， 后期修复这个bug后以下三行代码可以 删除。
//     if(_.isEmpty(sort) && !_.isEmpty(defaultSort)){
//       sort = defaultSort;
//     }
//     const result = await API.requestRecords(
//       __objectApiName,
//       filters,
//       fields,
//       {
//         pageSize: params.pageSize as number,
//         current: params.current as number,
//         sort: sort
//           ? Object.keys(sort).map((sk) => [
//               sk,
//               sort[sk] == "ascend" ? "asc" : "desc",
//             ])
//           : [],
//       }
//     )
//     setTotalRecords(result["@odata.count"])
//     return {
//       data: result.value,
//       success: true,
//       total: result["@odata.count"],
//     }
//   }

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
            _.forEach(columnFields, ({ fieldName, ...columnItem }: ObjectGridColumnProps) => {
              fields.push(fieldName)
            });
            const sort = []
            _.forEach(params.request.sortModel, (sortField)=>{
              sort.push([sortField.colId, sortField.sort])
            })
            const filters = defaultFilters;
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

  // const search = isMobile? false : {
  //   filterType: 'light',
  // }

  const getColumns = ()=>{

    const columns:any[] = [{
      resizable: false,
      width: 35,
      maxWidth: 35,
      minWidth: 35,
      checkboxSelection: true,
    }];
    _.forEach(columnFields, ({ fieldName, ...columnItem }: ObjectGridColumnProps) => {
      const field = object.schema.fields[fieldName]
      const filters = 
      columns.push({
        field: fieldName,
        headerName: field.label?field.label:fieldName,
        width: field.is_wide? 300: 150,
        minWidth: field.is_wide? 300: 150,
        resizable: true,
        filter: true,
        flex: 1,
        sortable: true,
        cellRenderer: 'proFieldRenderer',
        cellRendererParams: {
          fieldSchema: field,
          valueType: field.type,
        },
        cellEditor: 'proFieldEditor',
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
    });
    return columns
  }

  // return (
  //   <ProTable
  //     request={request}
  //     columns={proColumns}
  //     rowKey={rest.rowKey || "_id"}
  //     rowSelection={rest.rowSelection || { onChange }}
  //     pagination={{ ...rest.pagination, hideOnSinglePage: true }}
  //     columnEmptyText={false}
  //     actionRef={rest.actionRef || selfTableRef}
  //     onChange={() => {
  //       ;(rest.actionRef || selfTableRef).current.reload()
  //     }}
  //     params={{
  //       __objectApiName: objectApiName,
  //       __columnFields: columnFields,
  //       __defaultFilters: defaultFilters,
  //     }}
  //     search={search}
  //     toolbar={Object.assign({}, {
  //       subTitle: `${totalRecords} 个项目`
  //     }, toolbar)}
  //     size="small"
  //     className={["object-table", rest.className].join(" ")}
  //     {...rest}
  //   />
  // )
  return (

    <div className="ag-theme-balham" style={{height: 500}}>
      <AgGridReact
        columnDefs={getColumns()}
        rowModelType='serverSide'
        pagination={true}
        paginationPageSize={50}
        rowSelection='multiple'
        modules={[ServerSideRowModelModule]}
        stopEditingWhenGridLosesFocus={true}
        serverSideDatasource={getDataSource()}
        serverSideStoreType='partial'
        sideBar='filters'
        frameworkComponents = {{
          proFieldRenderer: ProFieldRenderer,
          proFieldEditor: ProFieldEditor,
          rowActions: RowActions,
        }}
      />
    </div>
  )
})
