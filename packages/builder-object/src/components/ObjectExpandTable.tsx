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

function getFilter(ids, key): string {
  return ids.map((id) => (key || "_id") + " eq '" + id + "'").join(" or ")
}
function getContainsFilter(ids, key): string {
  return ids
    .map((id) => "contains(" + (key || "_id") + ",'" + id + "')")
    .join(" or ")
}

export const ObjectExpandTable = observer((props: ObjectExpandTableProps) => {

  const {
    name: ObjectExpandTableId = "default",
    // includeSub,
    onChange,
    ...rest
  } = props

  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedExpandNode, setSelectedExpandNode] = useState([])

  // const flatChildren = (node) => {
  //   return [
  //     node,
  //     ...(node.children.length > 0
  //       ? _.flatten(node.children.map((c) => flatChildren(c)))
  //       : [null]),
  //   ].filter((a) => a)
  // }
  const handleExpandContentChange = (selectedNodes) => {
    //原先是过滤用户ID的。现有调整成过滤组织ID的方式
    // let tmpUsers=[]
    // selectedNodes.forEach(({ users }) => { tmpUsers = [...tmpUsers, ...users] });
    // tmpUsers = _.uniq(tmpUsers);
    //setSelectedUsers(tmpUsers)

    let tmpTreeNodes = []

    // if (includeSub) {
    //   selectedNodes = _.flatten(selectedNodes.map((node) => flatChildren(node)))
    // }

    selectedNodes.forEach(({ key }) => {
      tmpTreeNodes = [...tmpTreeNodes, key]
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

  useEffect(() => {
    tableRef.current?.reload()
  }, [tableRef.current])

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
          <ProCard colSpan="30%" className="expand-part">
            {expandProps.type == "tree" && (
              <ObjectTree
                {...expandProps}
                onChange={handleExpandContentChange}
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
                onChange={handleExpandContentChange}
              />
            )}
          </ProCard>
        )}
        <ProCard className="table-part" ghost>
          <ObjectTable
            {...rest}
            // filters={getFilter(selectedUsers.length>0?selectedUsers:['__none_exisit__'], "user")}
            filters={
              expandProps &&
              getContainsFilter(
                selectedExpandNode.length > 0 ? selectedExpandNode : [], //: ["__none_exisit__"],//本来的意思是,如果不选任何节点,就不能搜到任何人.现有调整成不选任何节点就找到所有人.
                expandProps.releatedColumnField
                // "organizations_parents"
              )
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
