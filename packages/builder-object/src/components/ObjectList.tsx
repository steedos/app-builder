/*
这是一个列表组件,将华炎魔方中的数据以列表的形式展示出来
 * @Author: Kent.Wood 
 * @Date: 2021-03-25 22:41:50 
 * @Last Modified by: Kent.Wood
 * @Last Modified time: 2021-03-25 22:52:28
 */
// import { BuilderStoreContext } from '@builder.io/react';
import { ObjectContext } from "@steedos/builder-steedos"
import { store } from "@steedos/builder-store"
import { List, Button } from "antd"
import _ from "lodash"
import { observer } from "mobx-react-lite"
import React, { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { registerObjectListComponent } from ".."

export type ObjectListProps =
  | ({
      name?: string
      objectApiName?: string
      nameField?: string
      filters?: string | string[]
      checkable?: boolean
      onChange?: (any) => void
    } & {
      defaultClassName: string
    })
  | any

export const ObjectList = observer((props: ObjectListProps) => {
  const objectContext: any = useContext(ObjectContext)
  let { currentObjectApiName } = store
  if (!currentObjectApiName) {
    currentObjectApiName = objectContext.currentObjectApiName
  }

  let {
    name: treeId = "default",
    objectApiName,
    nameField,
    filters,
    checkable,
    onChange,
    ...rest
  } = props
  if (checkable == undefined) checkable = true

  objectApiName = objectApiName || (currentObjectApiName as string)
  const { isLoading, error, data: objectSchema, isFetching } = useQuery<any>(
    objectApiName + "_schema",
    async () => {
      return await objectContext.requestObject(objectApiName as string)
    }
  )
  if (objectSchema) registerObjectListComponent(_.keys(objectSchema.fields))
  //上边都是schema相关的操作
  //下边才是去请求数据

  const [listData, setListData] = useState([])
  let { data: records } = useQuery(
    [objectApiName + "_records", nameField, filters, checkable], //这里以Props里的参数作为useQuery的第一参数，react-query会通过该参数是否发生变化来判断是否要重新进行请求
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
      setListData(records.value)
    }
  }, [records])

  return (
    <List
      style={{ width: "100%" }}
      dataSource={listData}
      renderItem={(record) => {
        return (
          <Button
            type="text"
            onClick={(e) => {
              onChange && onChange([record])
            }}
          >
            record[nameField]
          </Button>
        )
      }}
      {...rest}
    ></List>
  )
})