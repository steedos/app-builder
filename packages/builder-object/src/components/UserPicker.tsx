
import React, { useContext, useState, useRef } from "react"
import _ from 'lodash';
// import { BuilderStoreContext } from '@builder.io/react';
import { ObjectContext, ObjectTree, ObjectTable, ObjectTreeProps, ObjectTableProps } from ".."
import { useQuery } from "react-query";
import ProTable, { ProTableProps, RequestData } from "@ant-design/pro-table";
import { SortOrder } from "antd/lib/table/interface";
import { ParamsType } from "@ant-design/pro-provider";
import { observer } from "mobx-react-lite"
import { registerObjectTableComponent } from "..";
import { TableModel, store } from '@steedos/builder-store/src';
import ProCard from "@ant-design/pro-card"
//import styles from './UserPicker.less';
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

export type UserPickerProps = {
  name?: string
  includeSub?:boolean //是否包含其下子子孙孙
  onChange:([])=>void
  treeProps: ObjectTreeProps
  tableProps:any
} & {
    defaultClassName?: string
  }

function getFilter(ids: [string], key: string):string {
  return ids.map((id) => (key || "_id") + " eq '" + id + "'").join(" or ");
}
function getContainsFilter(ids: [], key: string): string {
  return ids.map((id) => 'contains('+(key || "_id") + ",'" + id + "')").join(" or ")
}

export const UserPicker = observer((
    props: UserPickerProps
  ) => {
    const objectContext = useContext(ObjectContext)
    let { currentObjectApiName } = store
    if (!currentObjectApiName) {
      currentObjectApiName = objectContext.currentObjectApiName
    }

    
    const {
      name: userPickerId = "default",
      includeSub,
      onChange,
      treeProps,
      tableProps,
      ...rest
  }:any = props
  
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  
  const flatChildren = (node: any) => {
    return [
      node,
      ...(node.children.length > 0
        ? _.flatten(node.children.map((c: any) => flatChildren(c)))
        : [null]),
    ].filter((a) => a)};
  const handleOrganizationChange = (selectedNodes: any[]) => {
    //原先是过滤用户ID的。现有调整成过滤组织ID的方式
    // let tmpUsers=[]
    // selectedNodes.forEach(({ users }) => { tmpUsers = [...tmpUsers, ...users] });
    // tmpUsers = _.uniq(tmpUsers);
    //setSelectedUsers(tmpUsers)
    
    let tmpOrgans:any = [];
    
    if (includeSub)
    {
      selectedNodes = _.flatten(selectedNodes.map((node: any) => flatChildren(node)));
    }
    
    selectedNodes.forEach(({ value }) => {
      tmpOrgans = [...tmpOrgans, value]
    })
    tmpOrgans = _.uniq(tmpOrgans)
    setSelectedOrganizations(tmpOrgans)
    // if (tmpUsers.length > 0)
    ref.current?.reload()
  }
  
  const handleUserChose = (selectedRowKeys: any[], selectedRows: any[]) => {
    // console.log(selectedRowKeys, selectedRows);
    onChange && onChange(selectedRows);
  }
  
  
  const ref:any = useRef()
  let ids: any = selectedOrganizations.length > 0 ? selectedOrganizations : ["__none_exisit__"];
    return (
      <ProCard  split="vertical" {...rest}>
        <ProCard colSpan="30%" ghost>
          <ObjectTree  {...treeProps} onChange={handleOrganizationChange} />
        </ProCard>
        <ProCard ghost>
          <ObjectTable
            {...tableProps}
            // filters={getFilter(selectedUsers.length>0?selectedUsers:['__none_exisit__'], "user")}
            filters={getContainsFilter(
              ids,
              "organizations_parents"
            )}
            manualRequest={true}
            actionRef={ref}
            rowKey="name"
            rowSelection={{ onChange: handleUserChose }}
          />
        </ProCard>
      </ProCard>
    )
  }
)