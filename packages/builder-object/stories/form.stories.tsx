import { ObjectForm, ObjectField, ObjectTable, ObjectTree, ObjectExpandTable } from "@steedos/builder-object";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"

import { Modal, TreeSelect, Select, Input, Button } from "antd"
import ProCard from "@ant-design/pro-card"
import queryString from "querystring"
import { useEffect, useState } from "react";

export default {
  title: "Builder Object",
}

export const Form = () => {
  const objectApiName = 'accounts';
  const fields = {
    grid: {
      type: 'grid',
      label: 'grid',
      group: 'grid',
      is_wide: true,
      sub_fields: {
        col1: {
          type: 'text'
        },
        col2: {
          type: 'boolean'
        },
      }
    },
    test: {
      type: 'text',
    },
    testImage: {
      type: 'image',
      label: '照片'
    },
    contracts: {
      reference_to: 'contracts',
      type: 'lookup',
      label: '合同',
      multiple: true,
      reference_sort: {
        create_date: -1,
        amount: -1,
      },
      reference_limit: 15,
    },
    object: {
      type: 'object',
      label: 'object',
      group: 'object',
      is_wide: true,
      sub_fields: {
        sub1: {
          type: 'text'
        },
        sub2: {
          type: 'boolean'
        },
      }
    }
  }
  const recordId = process.env.STEEDOS_CURRENT_RECORD_ID; //'KFon27jRaw5N7Q8fJ';
  const initialValues = {
    boolean__c: true,
    datetime__c: new Date(),
    autonumber__c: '2001-00001',
    percent__c: 0.55,
    name: 'xxx',
    grid: [{
      col1: '111',
      col2: true,
    }, {
      col1: '222',
      col2: true,
    }],
    object: {
      sub1: 'sub1',
      sub2: true,
    }
  };
  const objectFormProps = {
    objectApiName,
    fields,
    recordId,
    initialValues,
    mode: 'read',
    layout: 'horizontal' 
  }
  return (
      <ObjectForm {...objectFormProps}>
      </ObjectForm>
  )
}


export const FormWithChildren = () => {
  const objectApiName = 'accounts';
  const fields = []
  const recordId = process.env.STEEDOS_CURRENT_RECORD_ID;
  const objectFormProps = {
    objectApiName,
    fields,
    recordId,
  }
  const nameFieldSchema = {
    type: 'text',
    name: 'name',
    label: 'Name'
  }
  return (
      <ObjectForm {...objectFormProps}>
        <FieldSection title='Section'>
          <ObjectField objectApiName={objectApiName} fieldName='name' fieldSchema={nameFieldSchema}/>
          {/* <span>111</span> */}
        </FieldSection> 
      </ObjectForm>
  )
}


export const Table = () => {
  return (
      <ObjectTable objectApiName='accounts' columnFields={
        [
          {
            fieldName: 'name'
          },
          {
            fieldName: 'parent_id'
          },
          {
            fieldName: 'created'
          },
          {
            fieldName: 'created_by'
          },
          // {
          //   fieldName: 'type'
          // },
          // {
          //   fieldName: 'rating'
          // }
        ]
      }>
        
      </ObjectTable>
  )
}



export const Tree = () => {
  return (
      <ObjectTree objectApiName='organizations' nameField='name' parentField='parent'>
      </ObjectTree>
  )
}

export const App = () => {

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
              columnFields={[
                {
                  fieldName: "name",
                  sorter: true,
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
                  sorter: true,
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
  )
}