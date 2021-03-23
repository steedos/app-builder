// @ts-nocheck
import React, { useContext } from "react"
import _ from "lodash"
// import { BuilderStoreContext } from '@builder.io/react';
import { SteedosContext, ObjectContext } from "@steedos/builder-steedos/src"
import { useQuery } from "react-query"
import ProTree, { RequestData } from "@ant-design/pro-table"
import { SortOrder } from "antd/lib/table/interface"
import { ParamsType } from "@ant-design/pro-provider"
import { observer } from "mobx-react-lite"
import { Modal, TreeSelect, Select, Input, Button } from "antd"
// import { registerObjectTreeComponent } from "..";
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

export type ObjectTreeProps<
  T extends Record<string, any>,
  U extends ParamsType,
  ValueType
> =
  | ({
      name: string
      objectApiName?: string
      nameField?: string
      parentField?: string
      filter?: string
      treeCheckable?: boolean
      onChange?: (any) => void
    } & {
      defaultClassName: string
    })
  | any

export const ObjectTree = observer(
  <T extends Record<string, any>, U extends ParamsType, ValueType>(
    props: ObjectTreeProps<T, U, ValueType>
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
      filter,
      treeCheckable,
      onChange,
      ...rest
    } = props

    objectApiName = objectApiName || (currentObjectApiName as string)
    // const objectApiName = props.objectApiName ? props.objectApiName : currentObjectApiName as string;
    // const { isLoading, error, data, isFetching } = useQuery(
    //   objectApiName,
    //   async () => {
    //     return await objectContext.requestObject(objectApiName as string)
    //   }
    // )
    
    const { data } = await objectContext.requestObject(objectApiName as string)
    
    const objectSchema: any = data

    if (!objectSchema) return <div>Object Loading...</div>

    // registerObjectTreeComponent(_.keys(objectSchema.fields));

    const objectFields = objectSchema.fields

    const [treeData, setTreeData] = React.useState([])

    React.useEffect(() => {
      ;(async () => {
        let { data, success, total } = await objectContext.requestRecords(
          objectApiName,
          filter,
          objectFields
        )

        if (success && data) {
          let td: any = []
          let au: any = []
          let tp = {}
          data.forEach((d) => {
            let { _id, parent, children, ...rest } = d
            tp[_id] = tp[_id] || {
              value: _id,
              key: _id,
              title: d[nameField || "name"],
              children: [],
              ...rest,
            }
            tp[parent] ? tp[parent].children.push(tp[_id]) : (td = [tp[_id]])
          })
          setTreeData(td)
        }
      })()
    }, [])

    return (
      <TreeSelect
        placeholder="点击选择"
        style={{ width: "100%" }}
        treeCheckable={treeCheckable}
        treeDefaultExpandAll
        treeData={treeData}
        onChange={(values, texts) => {
          console.log(values, texts)
          onChange && onChange(texts)
        }}
        {...rest}
      ></TreeSelect>

      // <ProTree
      //   rowKey="_id"
      //   request={request}
      //   columns={proColumns}
      //   // formFieldComponent = {ObjectField}
      //   {...rest}
      // />
    )
  }
)
