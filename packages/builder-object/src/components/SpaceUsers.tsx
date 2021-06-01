import React from "react"
import { Alert, Spin } from 'antd';
import { User } from '@steedos/builder-store';
import { ObjectExpandTable, ObjectExpandTableProps, ObjectListView, ObjectModalListView } from ".."
import { observer } from "mobx-react-lite"
import { omit } from "lodash"

export type SpaceUsersProps = {
} & ObjectExpandTableProps

export const SpaceUsers = observer(({
  columnFields,
  filters,
  ...rest
}: SpaceUsersProps) => {
  const userSession = User.getSession();
  let defaultSaceUsersFilters: any = ["user_accepted", "=", true];
  let errorMessage:any;
  if (User.isLoading){
    // 这里不可以直接return (<div>Loading</div>) 上面有调用useRef
    console.log("Loading session...")
  }
  else{
    if(!userSession.is_space_admin){
      const orgIds = User.getCompanyOrganizationIds();
      if(orgIds && orgIds.length){
        // orgExpandFilters = [orgExpandFilters, [["_id", "=", orgIds], "or", ["parents", "=", orgIds]]];
        // 不是管理员时，要限定右侧用户范围为当前用户所属分部关联组织内
        defaultSaceUsersFilters = [defaultSaceUsersFilters, ["organizations_parents", "=", orgIds]];
        if(filters && filters.length){
          filters = [filters, defaultSaceUsersFilters]
        }else{
          filters = defaultSaceUsersFilters;
        }
      }
      else{
        console.error('您的账户未分配到任何分部，无法查看通讯录信息，请联系系统管理员！')
        errorMessage = <Alert message="您的账户没有权限访问此内容，请联络系统管理员。" type="warning" />
      }
    }
  }
  let props = {
    columnFields
  };
  if(!props.columnFields){
    props.columnFields = [{
      fieldName: "name",
      hideInSearch: true,
      sorter: true,
    },{
      fieldName: "email",
      hideInSearch: true,
    }]
  }
  return (
    User.isLoading ? (<Spin />) : ( errorMessage ? errorMessage :
      <ObjectModalListView
        filters={filters}
        objectApiName="space_users"
        {...props}
        {...omit(rest, ['objectApiName'])}
        />
      )
  )
});
