// eslint-disable-next-line
import React, { useState } from "react"
import logo from "./logo.svg"
import "./App.css"

import { SteedosProvider } from "@steedos/builder-steedos"
import { ObjectExpandTable, ObjectTable } from "@steedos/builder-object"

import { Modal, TreeSelect, Select, Input, Button } from "antd"
import ProCard from "@ant-design/pro-card"

const {
  REACT_APP_STEEDOS_ROOT_URL,
  REACT_APP_STEEDOS_TENANT_ID,
  REACT_APP_STEEDOS_USER_ID,
  REACT_APP_STEEDOS_AUTH_TOKEN,
  REACT_APP_STEEDOS_LOCALE = "zh_CN",
} = process.env

console.log(process.env)

function App() {
  const providerProps = {
    rootUrl: REACT_APP_STEEDOS_ROOT_URL,
    tenantId: REACT_APP_STEEDOS_TENANT_ID,
    userId: REACT_APP_STEEDOS_USER_ID,
    authToken: REACT_APP_STEEDOS_AUTH_TOKEN,
    locale: REACT_APP_STEEDOS_LOCALE,
  }

  const [selectedUser, setSelectedUsers] = useState([])
  const handleOnChange = (users: any) => {
    setSelectedUsers(users)
    console.log(users)
    // setSelectedEmails(users.map(({ name, email }) => `${name}<${email}>`))
  }
  const confirmChose = () => {
    console.log(selectedUser)
    // setSelectedEmails(users.map(({ name, email }) => `${name}<${email}>`))
  }

  return (
    <SteedosProvider {...providerProps}>
      <div className="App">
        <ProCard title="选择联系人" split="horizontal" bordered headerBordered>
          <ProCard
            ghost
            tabs={{
              type: "card",
            }}
          >
            <ProCard.TabPane key="tab1" tab="部门列表">
              <ObjectExpandTable
                onChange={handleOnChange}
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
            <ProCard.TabPane key="tab2" tab="联系人">
              <ObjectTable
                onChange={handleOnChange}
                rowKey="_id"
                objectApiName="contacts"
                columnFields={[
                  {
                    fieldName: "name",
                  },
                  {
                    fieldName: "email",
                  },
                  //  {
                  //                 fieldName: "space_users",
                  //                 expandType: 'list',
                  //                 expandReference: "contacts",
                  //                 expandNameField: "name",
                  //                 hideInTable: true,
                  //               },
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
            <Button onClick={confirmChose} type="primary">
              确定
            </Button>
          </ProCard>
        </ProCard>
      </div>
    </SteedosProvider>
  )
}

export default App
