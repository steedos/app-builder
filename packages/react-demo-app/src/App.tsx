// eslint-disable-next-line
import React, { useEffect, useState, useRef, useMemo } from "react"
// import logo from "./logo.svg"
import "./App.css"

import { SteedosProvider } from "@steedos/builder-object"
import { ObjectExpandTable } from "@steedos/builder-object"

import { Button } from "antd"
import ProCard from "@ant-design/pro-card"
import queryString from "querystring"
import { getAuthToken, getSpaceId, getUserId } from "./accounts"
import { Settings } from '@steedos/builder-store'
import useAntdMediaQuery from 'use-media-antd-query';
import { useResizeObserver } from "./use-resize-observer";

function App(props: any) {
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
    const scrollHeight = contentRectHeight - 280;
    return { y: scrollHeight }
  }, [contentRectHeight]);

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

    window.close()
    // setSelectedEmails(users.map(({ name, email }) => `${name}<${email}>`))
  }
  const colSize = useAntdMediaQuery();
  const isMobile = (colSize === 'sm' || colSize === 'xs');
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
      expandType: "tree",
      expandReference: "organizations",
      expandNameField: "name",
      expandParentField: "parent"
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
      fieldName: "group__c",
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
      fieldName: "group__c",
      hideInTable: true,
      expandType: "list",
      expandReference: "contacts_group__c",
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
              <ObjectExpandTable
                onChange={handleOnTab1Change}
                objectApiName="space_users"
                search={{
                  filterType: 'light',
                }}
                columnFields={organizationColumns}
                scroll={scroll}
                debounceTime={500}
              />
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
                objectApiName="contacts"
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
}

export default App
