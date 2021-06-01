import { ObjectForm, ObjectField, Iframe } from "@steedos/builder-object";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"
import ReactDOM from "react-dom";
import { API } from '@steedos/builder-store';
import { Link } from "react-router-dom";
import { Modal, TreeSelect, Select, Input, Button } from "antd"
import ProCard from "@ant-design/pro-card"
import queryString from "querystring"
import { useEffect, useState } from "react";
import TestObject from './test.object';

export default {
  title: "Object Form",
}

export const SchemaForm = () => {
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
    contracts2:['1','2'],
    contractsNo:['2021-009'],
    populationType: ['1','2'],
    // contracts_reference_to_func: {o:'contract_types',ids:['fcxTeWMEvgdMQnvwZ'],labels:["合同分类1"]},
    // contracts_reference_to_func: 'ebqwa4viwcwMZa7MY',
    object: {
      sub1: 'sub1',
      sub2: true,
    }
  };
  const objectFormProps = {
    objectSchema: TestObject,
    initialValues,
  }
  return (
      <ObjectForm mode='read' layout='horizontal' {...objectFormProps}>
      </ObjectForm>
  )
}


export const FormAccounts = () => {
  const objectApiName = 'accounts';
  const initialValues = {
  };
  const objectFormProps = {
    objectApiName,
    initialValues,
  }
  return (
      <ObjectForm mode='read' layout='horizontal' {...objectFormProps}>
      </ObjectForm>
  )
}

export const FormVertical = () => {
  const objectApiName = 'accounts';
  const fields = []
  const recordId = process.env.STEEDOS_CURRENT_RECORD_ID;
  const objectFormProps = {
    objectApiName,
    fields,
    recordId,
    mode: 'read',
    layout: 'vertical'
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

export const FormModal = () => {
  const schemaFormProps = {
    layout: 'horizontal',
    title: `合同信息`,
    objectSchema: {
      fields:{
        name: {
          type: 'text',
          label: "名称"
        },
        amount: {
          type: 'currency',
          label: "金额"
        }
      }
    },
    initialValues: {name:"合同", amount: "69000"},
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  };
  const objectFormProps = {
    objectApiName: "accounts",
    // recordId: {process.env.STEEDOS_CURRENT_RECORD_ID},
    layout: 'horizontal',
    title: `新建客户`,
    initialValues: {name:"张三"},
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  }
  return (
    <React.Fragment>
      <ObjectForm 
        {...schemaFormProps}
        trigger={<Button type="primary" >弹出SchemaForm</Button>}
      >
      </ObjectForm>
      <br />
      <br />
      <ObjectForm
        {...objectFormProps}
        trigger={<Button type="primary" >弹出ObjectForm示例</Button>}
      >
      </ObjectForm>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        window.SteedosUI.showModal(null,{
          name: "showModal-test1", 
          ...schemaFormProps
        })
      }}>showModal - 弹出SchemaForm示例</Button>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        window.SteedosUI.showModal(null,{
          name: "showModal-test2", 
          ...objectFormProps
        })
      }}>showModal - 弹出ObjectForm示例</Button>
    </React.Fragment>
  )
}

export const IframeTest = () => {
  return (
      <Iframe src="http://www.baidu.com/" width="100%" height="100%"/>
  )
}