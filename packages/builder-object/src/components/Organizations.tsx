import React from "react"
import { observer } from "mobx-react-lite"
import { omit } from "lodash"
import { User } from '@steedos/builder-store';
import { Alert, Spin } from 'antd';
import { ObjectTree, ObjectTreeProps } from ".."

export type OrganizationsProps = {
} & ObjectTreeProps

export const Organizations = observer(({
  columnFields,
  filters: defaultFilters,
  ...rest
}: OrganizationsProps) => {

  const userSession = User.getSession();
  let filters: any = ["hidden", "!=", true];
  let errorMessage:any;
  if (User.isLoading){
    console.log("Loading session...")
    return (<div><Spin/></div>);
  }
  else{
    if(!userSession.is_space_admin){
      const orgIds = User.getCompanyOrganizationIds();
      if(orgIds && orgIds.length){
        // 不是管理员时，要限定范围为当前用户所属分部关联组织内
        filters = [filters, [["_id", "=", orgIds], "or", ["parents", "=", orgIds]]];
      }
      else{
        console.error('您的账户未分配到任何分部，无法查看通讯录信息，请联系系统管理员！')
        errorMessage = <Alert message="您的账户没有权限访问此内容，请联络系统管理员。" type="warning" />
      }
    }
  }
  let props = {
    objectApiName: "organizations",
    nameField: "name",
    parentField: "parent",
    filters
  };
  return (
    ( 
      errorMessage ? errorMessage :
      <ObjectTree
        {...props}
        {...omit(rest, ['objectApiName'])}
      />
    )
  )
});
