// eslint-disable-next-line
import React, { useEffect, useState, useRef, useMemo } from "react"
// import logo from "./logo.svg"
import "./App.less"

import { SteedosProvider } from "@steedos/builder-object"
import { ObjectExpandTable } from "@steedos/builder-object"
import { observer } from "mobx-react-lite";
import { Settings, User } from '@steedos/builder-store';

import { Button } from "antd"
import ProCard from "@ant-design/pro-card"
import queryString from "querystring"
import { getAuthToken, getSpaceId, getUserId } from "./accounts"
import useAntdMediaQuery from 'use-media-antd-query';
import { useResizeObserver } from "./use-resize-observer";
import { Spin } from 'antd';

export default observer((props: any) => {
  
  let queryObject = queryString.parse(window.location.search.slice(1))
  const providerProps = {
    rootUrl: queryObject.rooturl || Settings.rootUrl || "/",
    tenantId:
      queryObject.spaceid || getSpaceId() || Settings.tenantId, //REACT_APP_STEEDOS_TENANT_ID,
    userId: queryObject.userid || getUserId() || Settings.userId,
    authToken:
      queryObject.authtoken || getAuthToken() || Settings.authToken,
    locale: Settings.locale,
  }

  const [selectedUser, setSelectedUsers] = useState([])
  const [selectedUserInTab1, setSelectedUsersInTab1] = useState([])
  const [selectedUserInTab2, setSelectedUsersInTab2] = useState([])

  const handleOnTab1Change = (users: any) => {
    setSelectedUsersInTab1(users)
  }
  const handleOnTab2Change = (users: any) => {
    setSelectedUsersInTab2(users)
  }

  const resizeSubject = useRef()
  const contentRect: any = useResizeObserver(resizeSubject, (current: any)=>(current.firstChild));
  const contentRectHeight = contentRect.height;
  const scroll = useMemo(() => {
    let scrollHeight = contentRectHeight - 276;
    if(selectedUserInTab1 && selectedUserInTab1.length){
      scrollHeight -= 64;
    }
    return { y: scrollHeight }
  }, [contentRectHeight, selectedUserInTab1]);

  useEffect(() => {
    setSelectedUsers([...selectedUserInTab1, ...selectedUserInTab2])
  }, [selectedUserInTab1, selectedUserInTab2])

  // const handleOnChange = (users: any) => {
  //   setSelectedUsers(users)
  //   // setSelectedEmails(users.map(({ name, email }) => `${name}<${email}>`))
  // }
  const confirmChose = () => {
    ;(window.opener || window.parent).postMessage(
      {
        ...queryObject,
        selection: selectedUser.map(({ name, email }) => ({ name, email })),
      },
      "*"
    )

    // window.close()
    // setSelectedEmails(users.map(({ name, email }) => `${name}<${email}>`))
  }
  const colSize = useAntdMediaQuery();
  const isMobile = (colSize === 'sm' || colSize === 'xs');

  const userSession = User.getSession();
  let spaceUsersFilters: any = ["user_accepted", "=", true];
  let orgExpandFilters: any = ["hidden", "!=", true];
  if (User.isLoading){
    // 这里不可以直接return (<div>Loading</div>) 上面有调用useRef
    console.log("Loading session...")
  }
  else{
    if(!userSession.is_space_admin){
      const orgIds = User.getCompanyOrganizationIds();
      if(orgIds && orgIds.length){
        orgExpandFilters = [orgExpandFilters, [["_id", "=", orgIds], "or", ["parents", "=", orgIds]]];
        // 不是管理员时，要限定右侧用户范围为当前用户所属分部关联组织内
        spaceUsersFilters = [spaceUsersFilters, ["organizations_parents", "=", orgIds]];
      }
    }
  }

  const organizationColumns = isMobile ? [
    {
      fieldName: "name",
      hideInSearch: true,
      sorter: true,
    },
    {
      fieldName: "email",
      hideInSearch: true,
    },
    {
      fieldName: "organizations_parents",
      hideInTable: true
    }
  ] : [
    {
      fieldName: "name",
      sorter: true,
    },
    {
      fieldName: "email",
    },
    {
      fieldName: "organizations_parents",
      hideInTable: true,
      hideInSearch: true,
      expandType: "tree",
      expandReference: "organizations",
      expandNameField: "name",
      expandParentField: "parent",
      expandFilters: orgExpandFilters
    }
  ];
  const groupColumns = isMobile ? [
    {
      fieldName: "name",
      sorter: true,
      hideInSearch: true,
    },
    {
      fieldName: "email",
      hideInSearch: true,
    },
    {
      fieldName: "group",
      hideInTable: true
    },
  ] : [
    {
      fieldName: "name",
      sorter: true,
    },
    {
      fieldName: "email",
    },
    {
      fieldName: "group",
      hideInTable: true,
      expandType: "list",
      expandReference: "contacts_group",
      expandNameField: "name"
    }
  ];
  return (
    <SteedosProvider {...providerProps}>
      <div className="App" ref={resizeSubject}>
        <ProCard
          className="main-container"
          title=""
          split="horizontal"
          bordered
          headerBordered
        >
          <ProCard
            style={{ height: "calc(100% - 60px)" }}
            tabs={{
              type: "card",
            }}
            // ref={resizeSubject}
          >
            <ProCard.TabPane
              key="tab1"
              tab={`用户${
                selectedUserInTab1.length > 0
                  ? "(" + selectedUserInTab1.length + ")"
                  : ""
              }`}
            >
              {
                User.isLoading ? (<Spin />) : (
                  <ObjectExpandTable
                    onChange={handleOnTab1Change}
                    objectApiName="space_users"
                    search={{
                      filterType: 'light',
                    }}
                    columnFields={organizationColumns}
                    scroll={scroll}
                    debounceTime={500}
                    filters={spaceUsersFilters}
                  />
                )
              }
            </ProCard.TabPane>
            <ProCard.TabPane
              key="tab2"
              tab={`联系人${
                selectedUserInTab2.length > 0
                  ? "(" + selectedUserInTab2.length + ")"
                  : ""
              }`}
            >
              <ObjectExpandTable
                onChange={handleOnTab2Change}
                rowKey="_id"
                objectApiName="contacts__c"
                search={{
                  filterType: 'light',
                }}
                columnFields={groupColumns}
                scroll={scroll}
                debounceTime={500}
              />
            </ProCard.TabPane>
          </ProCard>
          <ProCard
            style={{ height: "60px" }}
            bodyStyle={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              disabled={selectedUser.length <= 0}
              onClick={confirmChose}
              type="primary"
            >
              确定
            </Button>
          </ProCard>
        </ProCard>
      </div>
    </SteedosProvider>
  )
});