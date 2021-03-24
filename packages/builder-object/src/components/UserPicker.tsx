
import React, { useContext, useState, useRef } from "react"
import _ from 'lodash';
// import { BuilderStoreContext } from '@builder.io/react';
import { ObjectContext, ObjectTree, ObjectTable, ObjectTreeProps } from ".."
import { useQuery } from "react-query";
import ProTable, { ProTableProps, RequestData } from "@ant-design/pro-table";
import { SortOrder } from "antd/lib/table/interface";
import { ParamsType } from "@ant-design/pro-provider";
import { observer } from "mobx-react-lite"
import { registerObjectTableComponent } from "..";
import { TableModel, store } from '@steedos/builder-store';
import ProCard from "@ant-design/pro-card"

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
  fieldName: string,
  wrap?: boolean
}

export type UserPickerProps = {
  name?: string
  onChange:([any])=>void
    treeProps: ObjectTreeProps
  tableProps:ObjectTableProps
} & {
    defaultClassName?: string
  }

function getFilter(ids, key):string {
  return ids.map((id) => (key || "_id") + " eq '" + id + "'").join(" or ");
}

export const UserPicker = observer((
    props: UserPickerProps
  ) => {
    // export const UserPicker = <T extends Record<string, any>, U extends ParamsType, ValueType>(props: ObjectTableProps<T, U, ValueType>) => {
    // const store = useContext(BuilderStoreContext);
    const objectContext = useContext(ObjectContext)
    let { currentObjectApiName } = store
    if (!currentObjectApiName) {
      currentObjectApiName = objectContext.currentObjectApiName
    }

    
    const {
      name: userPickerId = "default",
      onChange,
      treeProps,
      tableProps,
      ...rest
  } = props
  
  const [selectedUsers, setSelectedUsers] = useState([])
  const handleOrganizationChange = (selectedNodes) => {
    let tmpUsers=[]
    selectedNodes.forEach(({ users }) => { tmpUsers = [...tmpUsers, ...users] });
    tmpUsers = _.uniq(tmpUsers);
    setSelectedUsers(tmpUsers);
    if (tmpUsers.length > 0)
       ref.current?.reload()
  }
  
  const handleUserChose = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRowKeys, selectedRows);
    onChange && onChange(selectedRows);
  }
  
  
  const ref = useRef<ActionType>()

    return (
      <ProCard split="vertical" {...rest}>
        <ProCard colSpan="30%" ghost>
          <ObjectTree {...treeProps} onChange={handleOrganizationChange} />
        </ProCard>
        <ProCard>
          <ObjectTable
            {...tableProps}
            filters={getFilter(selectedUsers, "user")}
            manualRequest={true}
            actionRef={ref}
            rowKey="name"
            rowSelection={{ onChange :handleUserChose}}
          />
        </ProCard>
      </ProCard>
    )
  }
)