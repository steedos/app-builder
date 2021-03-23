import React, { useContext, useEffect, useState } from "react"
import _ from "lodash"
// import { BuilderStoreContext } from '@builder.io/react';
import { ObjectContext } from "../../../builder-steedos/src/"
import { useQuery } from "react-query"
import ProTree, { RequestData } from "@ant-design/pro-table"
import { SortOrder } from "antd/lib/table/interface"
import { ParamsType } from "@ant-design/pro-provider"
import { observer } from "mobx-react-lite"
import { Modal, TreeSelect, Select, Input, Button, Tree } from "antd"
import { registerObjectTreeComponent } from ".."
import { store } from "@steedos/builder-store"

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

export type ObjectTreeProps= ({
      name?: string
      objectApiName?: string
      nameField?: string
      parentField?: string
      rootNodeValue?: string
      filters?: string|string[]
      checkable?: boolean
      onChange?: (any) => void
    } & {
      defaultClassName: string
    })
  | any

export const ObjectTree = observer( (
    props: ObjectTreeProps 
  ) => {
    // export const ObjectTree = <T extends Record<string, any>, U extends ParamsType, ValueType>(props: ObjectTreeProps<T, U, ValueType>) => {
    // const store = useContext(BuilderStoreContext);
    const objectContext = useContext(ObjectContext)
    let { currentObjectApiName } = store
    if (!currentObjectApiName) {
      currentObjectApiName = objectContext.currentObjectApiName
    }

    let {
      name: treeId = "default",
      objectApiName,
      nameField,
      parentField,
      rootNodeValue,
      filters,
      checkable,
      onChange,
      ...rest
    } = props
    if (checkable == undefined)
      checkable = true;
    
    objectApiName = objectApiName || (currentObjectApiName as string)
    const { isLoading, error, data: objectSchema, isFetching } = useQuery<any>(
      objectApiName+'_schema',
      async () => {
        return await objectContext.requestObject(objectApiName as string)
      }
    )
    if (objectSchema) registerObjectTreeComponent(_.keys(objectSchema.fields))
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
        ],//这里以Props里的参数作为useQuery的第一参数，react-query会通过该参数是否发生变化来判断是否要重新进行请求
        async () => {
          const objectFields = Object.values(objectSchema.fields)
            .filter(({ hidden }) => !hidden)
            .map(({ name }) => name)
          return await objectContext.requestRecords(
            objectApiName as string,
            filters,
            objectFields
          )
        },
        { enabled: !!objectSchema } //只有上边的schema加载好了，才启用下边的记录查询
      )
    
    useEffect(() => {
      if (records) {
        let td: any = []
        let ek: any = []
        let tp: any = {}
        
          ; (records as any[]).forEach((d) => {
            let { _id, children, ...rest } = d
            let parent = rest[parentField || "parent"]
            tp[_id] = tp[_id] || {
              value: _id,
              key: _id,
              title: d[nameField || "name"],
              children: [],
              ...rest,
            }
            ek.push(_id);
            tp[parent] ? tp[parent].children.push(tp[_id]) : (td = [tp[_id]])
          })
        if (rootNodeValue) {
          td = (tp[rootNodeValue] && [tp[rootNodeValue]]) || []
        }
        setTreeData(td);
        setExpandedKeys(ek);
      }
    }, [records]);
    

    return (
      <Tree
        style={{ width: "100%" }}
        checkable={checkable}
        expandedKeys={expandedKeys}
        treeData={treeData}
        onCheck={(values, { checkedNodes }) => {
          console.log(values, checkedNodes)
          onChange && onChange(checkedNodes)
        }}
        {...rest}
      ></Tree>
    )
  }
)
