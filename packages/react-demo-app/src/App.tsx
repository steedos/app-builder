// eslint-disable-next-line
import React, { useEffect, useState } from "react"
import logo from "./logo.svg"
import "./App.css"

import { SteedosProvider } from "@steedos/builder-steedos"
import { ObjectExpandTable, ObjectTable } from "@steedos/builder-object"

import { Modal, TreeSelect, Select, Input, Button } from "antd"
import ProCard from "@ant-design/pro-card"
import queryString from "querystring"
const {
  REACT_APP_STEEDOS_ROOT_URL,
  REACT_APP_STEEDOS_TENANT_ID,
  REACT_APP_STEEDOS_USER_ID,
  REACT_APP_STEEDOS_AUTH_TOKEN,
  REACT_APP_STEEDOS_LOCALE = "zh_CN",
} = process.env

function App(props: any) {
  const providerProps = {
    rootUrl: REACT_APP_STEEDOS_ROOT_URL,
    tenantId: REACT_APP_STEEDOS_TENANT_ID, //REACT_APP_STEEDOS_TENANT_ID,
    userId: REACT_APP_STEEDOS_USER_ID,
    authToken: REACT_APP_STEEDOS_AUTH_TOKEN,
    locale: REACT_APP_STEEDOS_LOCALE,
  }

  let queryObject = queryString.parse(window.location.search.slice(1))

  const [selectedUser, setSelectedUsers] = useState([])
  const [selectedUserInTab1, setSelectedUsersInTab1] = useState([])
  const [selectedUserInTab2, setSelectedUsersInTab2] = useState([])

  const handleOnTab1Change = (users: any) => {
    setSelectedUsersInTab1(users)
  }
  const handleOnTab2Change = (users: any) => {
    setSelectedUsersInTab2(users)
  }

  useEffect(() => {
    setSelectedUsers([...selectedUserInTab1, ...selectedUserInTab2])
  }, [selectedUserInTab1, selectedUserInTab2])

  const handleOnChange = (users: any) => {
    setSelectedUsers(users)
    // setSelectedEmails(users.map(({ name, email }) => `${name}<${email}>`))
  }
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

  return (
    <SteedosProvider {...providerProps}>
      <div className="App">
        <ProCard title="" split="horizontal" bordered headerBordered>
          <ProCard
            tabs={{
              type: "card",
            }}
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
                columnFields={[
                  {
                    fieldName: "name",
                  },
                  {
                    fieldName: "email",
                  },
                  {
                    fieldName: "organizations_parents",
                    expandType: "tree",
                    expandReference: "organizations",
                    expandNameField: "name",
                    expandParentField: "parent",
                    hideInTable: true,
                  },
                ]}
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
                columnFields={[
                  {
                    fieldName: "name",
                  },
                  {
                    fieldName: "email",
                  },
                  {
                    fieldName: "group__c",
                    expandType: "list",
                    expandReference: "contacts_group__c",
                    expandNameField: "name",
                    hideInTable: true,
                  },
                ]}
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