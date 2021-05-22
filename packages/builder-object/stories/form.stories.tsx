import { ObjectForm, ObjectField, Iframe } from "@steedos/builder-object";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"
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

export const JsonForm = () => {
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
  const objectApiName = 'object_layouts';
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


export const IframeTest = () => {
  return (
      <Iframe src="http://www.baidu.com/" width="100%" height="100%"/>
  )
}