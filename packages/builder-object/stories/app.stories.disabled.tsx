
import { ObjectForm, ObjectField, ObjectTable, ObjectTree, ObjectExpandTable } from "@steedos/builder-object";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"

import { Modal, TreeSelect, Select, Input, Button } from "antd"
import ProCard from "@ant-design/pro-card"
import queryString from "querystring"
import { useEffect, useState } from "react";
import useAntdMediaQuery from 'use-media-antd-query';

export default {
  title: "Builder App",
}

export const SelectUsers = () => {

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
    <div className="App">
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
  )
}