/*
该组件在ObjectTable的基础上,扩展了左侧内容.提供List和Tree两种形式展示
通过columnFields里添加相关属性来驱动

 * @Author: Kent.Wood 
 * @Date: 2021-03-25 22:35:51 
 * @Last Modified by: Kent.Wood
 * @Last Modified time: 2021-03-29 20:56:02
 */

import ProCard from "@ant-design/pro-card"
import _ from "lodash"
import { observer } from "mobx-react-lite"
import React, { useContext, useEffect, useRef, useState } from "react"
import { ActionType } from "react-table"
import { formatFiltersToODataQuery } from '@steedos/filters';
import "./ObjectExpandTable.less"

import {
  ObjectContext,
  ObjectList,
  ObjectTable,
  ObjectTableColumnProps,
  ObjectTableProps,
  ObjectTree,
} from ".."

export type ObjectExpandTableColumnProps = {
  expandType?: "tree" | "list" //两种扩展内容形式
  expandReference?: string //针对树显示所使用的对象名.等于树的objectApiName
  expandNameField?: string //树中用于显示的字段名
  expandParentField?: string //树中对象的父级的字段名，默认是parent,只在expand为tree时有效
  expandFilters?: [] | string //树中过滤条件
} & ObjectTableColumnProps

export type ObjectExpandTableProps =
  | ({
      name?: string
      //parentField: string //当前对象的父级对象，用于树形结构呈现时使用
      onChange: ([any]) => void
      columnFields: ObjectExpandTableColumnProps[]
    } & ObjectTableProps<ObjectExpandTableColumnProps> & {
        defaultClassName?: string
      })
  | any

function getTableFilter(expandProps: any, selectedExpandNode: string[], defaultFilters: string | []) {
  const expandKey = expandProps && expandProps.releatedColumnField;
  let expandFilters: any;
  if(expandKey && selectedExpandNode.length){
    expandFilters = [expandKey, "=", selectedExpandNode];
  }
  if(expandFilters){
    if(defaultFilters && defaultFilters.length){
      if (_.isArray(defaultFilters)) {
          return [defaultFilters, expandFilters]
      }
      else {
          const odataExpandFilters = formatFiltersToODataQuery(expandFilters);
          return `(${defaultFilters}) and (${odataExpandFilters})`;
      }
    }
    else{
      return expandFilters;
    }
  }
  else{
    return defaultFilters;
  }
}

export const ObjectExpandTable = observer((props: ObjectExpandTableProps) => {

  const {
    name: ObjectExpandTableId = "default",
    filters,
    // includeSub,
    onChange,
    ...rest
  } = props

  const [selectedExpandNode, setSelectedExpandNode] = useState([])

  const handleExpandContentChange = (selectedNodes: object[], keyField?: string) => {
    if(!keyField){
      keyField = "key";
    }
    let tmpTreeNodes = []
    selectedNodes.forEach((node) => {
      tmpTreeNodes = [...tmpTreeNodes, node[keyField]]
    })
    tmpTreeNodes = _.uniq(tmpTreeNodes)
    setSelectedExpandNode(tmpTreeNodes)
    tableRef.current?.reload()
  }

  const handleTableRowChose = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRowKeys, selectedRows);
    onChange && onChange(selectedRows)
  }

  const tableRef = useRef<ActionType>()

  // 不懂为什么要加这个useEffect，加上的坏处是手机上切换到联系人列表后，切换顶部的联系人分类时会请求space_users数据
  // 不加的话也没发现什么坏处，即手机和PC上从用户选项卡切换到联系人选项卡都能正常请求数据
  // useEffect(() => {
  //   tableRef.current?.reload()
  // }, [tableRef.current])

  const [expandProps, setExpandProps] = useState<{
    type: string
    objectApiName: string
    nameField: string
    parentField: string
    releatedColumnField: string
    filters?: string | []
    }>(null)

  useEffect(() => {
    let expandDefine:
      | {
          expandType
          expandReference
          expandNameField
          expandParentField
          fieldName
          filters
        }
      | any = props.columnFields.find(
      ({
        expandType,
        expandReference,
        expandNameField,
        expandParentField,
        fieldName,
      }) => {
        if (expandType) {
          return {
            expandType,
            expandReference,
            expandNameField,
            expandParentField,
            fieldName,
          }
        }
      }
    )

    setExpandProps(
      expandDefine && {
        type: expandDefine.expandType,
        objectApiName: expandDefine.expandReference,
        nameField: expandDefine.expandNameField,
        parentField: expandDefine.expandParentField,
        releatedColumnField: expandDefine.fieldName,
        filters: expandDefine.expandFilters
      }
    )
  }, [props.columnFields])

  return (
    <>
      <ProCard
        split="vertical"
        className={["object-expand-table", rest.className].join(" ")}
      >
        {expandProps && expandProps.type && (
          <ProCard colSpan="340px" className="expand-part">
            {expandProps.type == "tree" && (
              <ObjectTree
                {...expandProps}
                onChange={(values: any)=>{
                  handleExpandContentChange(values, "key");
                }}
              />
            )}
            {expandProps.type == "list" && (
              <ObjectList
                {...(() => {
                  let {
                    parentField,
                    releatedColumnField,
                    ...expandPropsRest
                  } = expandProps
                  return expandPropsRest
                })()}
                onChange={(values: any)=>{
                  handleExpandContentChange(values, "_id");
                }}
              />
            )}
          </ProCard>
        )}
        <ProCard className="table-part" ghost>
          <ObjectTable
            {...rest}
            filters={
              getTableFilter(expandProps, selectedExpandNode, filters)
            }
            // manualRequest={true}
            actionRef={tableRef}
            onChange={handleTableRowChose}
          />
        </ProCard>
      </ProCard>
    </>
  )
})
