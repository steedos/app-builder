import { Tree } from "antd"
import { isArray } from "lodash"
import { observer } from "mobx-react-lite"
import React, { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { Objects, API } from "@steedos/builder-store"
import { formatFiltersToODataQuery } from '@steedos/filters';
import { getTreeDataFromRecords } from '../utils';
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
      filters?: string | []
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
    defaultSelectedKeys,
    ...rest
  } = props
  const [selectedKeys, setselectedKeys] = useState(defaultSelectedKeys ? defaultSelectedKeys : [] )
  if (checkable == undefined) checkable = true

  const object = Objects.getObject(objectApiName);

  //上边都是schema相关的操作
  //下边才是去请求数据

  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])

  const schema = !object.isLoading && object.schema; 
  if(schema){
    if(!nameField){
      nameField = schema.NAME_FIELD_KEY || 'name';
    }
    if(!parentField){
      parentField = schema.parent_field || 'parent';
    }
  }

  // TODO: 暂时先合并当前选中值作为filters， 后期再优化下。
  const keyFilters: any = ['_id', '=', defaultSelectedKeys];
  if (defaultSelectedKeys && defaultSelectedKeys.length && filters && filters.length) {
    if (isArray(filters)) {
      filters = [keyFilters, "or", filters]
    }
    else {
      const odataKeyFilters = formatFiltersToODataQuery(keyFilters);
      filters = `(${odataKeyFilters}) or (${filters})`;
    }
  }
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
      const treeData = getTreeDataFromRecords(records.value, nameField, parentField);
      if(treeData && treeData.length){
        setTreeData(treeData);
        const rootNodeValues = treeData.map((treeItem)=>{
          return treeItem.value;
        });
        setExpandedKeys(rootNodeValues)
      }
    }
  }, [records])

  if (object.isLoading) return (<div>Loading object ...</div>)
  return (
    <Tree
      style={{ width: "100%" }}
      // checkable={checkable}
      selectedKeys={selectedKeys}
      expandedKeys={expandedKeys}
      treeData={treeData}
      onExpand={(expandedKeys, { expanded, node }) => {
        setExpandedKeys(expandedKeys)
      }}
      onSelect={(values, { selectedNodes }) => {
        setselectedKeys(values)
        onChange && onChange(values, selectedNodes)
      }}
      {...rest}
    ></Tree>
  )
})
