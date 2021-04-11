import { Tree } from "antd"
import _ from "lodash"
import { observer } from "mobx-react-lite"
import React, { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { Objects, API } from "@steedos/builder-store"
import "./ObjectTree.less"
// export type TreeProps<T extends Record<string, any>, U extends ParamsType, ValueType>  = {
//   mode?: ProFieldFCMode,
//   editable?: boolean,
// } & ProTreeProps<T, U, ValueType> & {
//   defaultClassName: string;
// }

// export type ObjectTreeProps = {
//   objectApiName?: string,
//   recordId?: string,
// } & ProTreeProps<T, U, ValueType> & {
//   defaultClassName: string;
// }

export type ObjectTreeProps =
  | ({
      name?: string
      objectApiName?: string
      nameField?: string
      parentField?: string
      rootNodeValue?: string
      filters?: string | string[]
      checkable?: boolean
      onChange?: () => void
    } & {
      defaultClassName: string
    })
  | any

export const ObjectTree = observer((props: ObjectTreeProps) => {

  let {
    name: treeId = "default",
    objectApiName,
    nameField,
    parentField,
    releatedColumnField,
    rootNodeValue,
    filters,
    checkable,
    onChange,
    ...rest
  } = props
  if (checkable == undefined) checkable = true

  const object = Objects.getObject(objectApiName);

  //上边都是schema相关的操作
  //下边才是去请求数据

  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  let { data: records } = useQuery(
    [
      objectApiName + "_records",
      nameField,
      parentField,
      rootNodeValue,
      filters,
      checkable,
    ], //这里以Props里的参数作为useQuery的第一参数，react-query会通过该参数是否发生变化来判断是否要重新进行请求
    async () => {
      // const objectFields = Object.values(object.schema.fields)
      //   .filter(({ hidden }) => !hidden)
      //   .map(({ name }) => name)
      const objectFields = [nameField, parentField]
      return await API.requestRecords(
        objectApiName as string,
        filters,
        objectFields
      )
    },
    { enabled: !object.isLoading } //只有上边的schema加载好了，才启用下边的记录查询
  )

  useEffect(() => {
    if (records) {
      let td: any = []
      let ek: any = []
      let tp: any = {}
      let _rootNodeValue = rootNodeValue
      ;(records.value as any[]).forEach((d) => {
        let { _id, ...rest } = d
        let parent = rest[parentField || "parent"]
        tp[_id] = {
          value: _id,
          key: _id,
          title: d[nameField || "name"],
          children: [],
          _id,
          ...rest,
          ...(tp[_id] || {}),
        }
        ek.push(_id)
        if (parent) {
          if (tp[parent]) {
            tp[parent].children.push(tp[_id])
          } else tp[parent] = { children: [tp[_id]] }
        } else if (!parent) {
          td = [tp[_id]]
          _rootNodeValue = _id
        }
      })
      if (_rootNodeValue) {
        td = (tp[_rootNodeValue] && [tp[_rootNodeValue]]) || []
      }
      setTreeData(td)
      // setExpandedKeys(ek)
      setExpandedKeys([_rootNodeValue])
    }
  }, [records])

  if (object.isLoading) return (<div>Loading object ...</div>)
  return (
    <Tree
      style={{ width: "100%" }}
      // checkable={checkable}
      expandedKeys={expandedKeys}
      treeData={treeData}
      onExpand={(expandedKeys, { expanded, node }) => {
        setExpandedKeys(expandedKeys)
      }}
      onSelect={(values, { selectedNodes }) => {
        onChange && onChange(selectedNodes)
      }}
      // onCheck={(values, { checkedNodes }) => {
      //   console.log(values, checkedNodes)
      //   onChange && onChange(checkedNodes)
      // }}
      {...rest}
    ></Tree>
  )
})
