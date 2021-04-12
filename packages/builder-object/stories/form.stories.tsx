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
      options:[
        { label: '合同1', value: 1 },
        { label: '合同2', value: 2 },
        { label: '合同3', value: 3 },
      ],
      reference_limit: 15,
    },
    populationType: {
      type: 'select',
      label: '人群类型多选',
      // TODO:icon参数最后再加上测试（因为有点复杂）。
      options:[
        { label: '老人',   value:'1' },
        { label: '中年人', value: '2' },
        { label: '年轻人', value: '3' },
        { label: '孩童', value: '4' }
      ],
      optionsFunction:()=>{
        return [{label: '小孩', value: 2}, {label: '婴儿', value: 1}]
      },
      multiple: true,
    },
    populationTypeSingle: {
      type: 'select',
      label: '人群类型单选',
      // TODO:icon参数最后再加上测试（因为有点复杂）。
      options:[
        { label: '老人',   value:'1' },
        { label: '中年人', value: '2' },
        { label: '年轻人', value: '3' },
        { label: '孩童', value: '4' }
      ],
      multiple: false,
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
    objectSchema: {
      fields,
    },
    recordId,
    initialValues,
  }
  return (
      <ObjectForm mode='read' layout='horizontal' {...objectFormProps}>
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