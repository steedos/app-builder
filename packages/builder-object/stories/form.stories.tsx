import { ObjectForm, ObjectField, ObjectTable, ObjectTree, ObjectListView, ObjectExpandTable } from "@steedos/builder-object";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"
import { API } from '@steedos/builder-store';
import { Link } from "react-router-dom";
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
      group:'lookup测试',
      reference_to: 'contracts',
      type: 'lookup',
      label: '合同',
      multiple: true,
      reference_sort: {
        create_date: -1,
        amount: -1,
      },
      // options:[
      //   { label: '合同1', value: 1 },
      //   { label: '合同2', value: 2 },
      //   { label: '合同3', value: 3 },
      // ],
      // optionsFunction:(para:any)=>{
      //   const column = [
      //     { label: '大合同1', value: 1 },
      //     { label: '大合同2', value: 2 },
      //     { label: '大合同3', value: 3 },
      //   ]
      //   return column;
      // },
      reference_limit: 15,
      filters:[['amount','between',[0,100000]]],
      filtersFunction:(filters)=>{
        return [['amount','between',[5,90000]]]
        // return "(amount ge 15)"
        // return "((amount ge 15) and (amount le 40))"
      }
    },
    contractsNo: {
      group:'lookup测试',
      reference_to: 'contracts',
      reference_to_field: "no",
      type: 'lookup',
      label: '合同编号',
      multiple: true,
    },
    contracts_sort: {
      group:'lookup测试',
      reference_to: 'contracts',
      type: 'lookup',
      label: 'reference_sort',
      reference_sort: {
        create_date: 1,
        amount: -1,
      },
    },
    contracts_reference_limit: {
      group:'lookup测试',
      reference_to: 'contracts',
      type: 'lookup',
      label: 'reference_limit',
      reference_limit: 3,
    },
    contracts_filtersFunction: {
      group:'lookup测试',
      reference_to: 'contracts',
      type: 'lookup',
      label: 'filters(Function)',
      filters:[['amount','between',[0,10000]]],
      filtersFunction:(filters)=>{
        return [['amount','between',[10,50]]]
        // return "(amount ge 15)"
        // return "((amount ge 15) and (amount le 40))"
      }
    },
    contracts_optionsFunction: {
      group:'lookup测试',
      reference_to: 'contracts',
      type: 'lookup',
      label: 'options(Function)',
      options:[
        { label: '合同1', value: 1 },
        { label: '合同2', value: 2 },
        { label: '合同3', value: 3 },
      ],
      optionsFunction:(para:any)=>{
        const column = [
          { label: '大合同1', value: 1 },
          { label: '大合同2', value: 2 },
          { label: '大合同3', value: 3 },
        ]
        return column;
      },
    },
    contracts_multiple: {
      group:'lookup测试',
      reference_to: 'contracts',
      type: 'lookup',
      label: 'multiple',
      multiple: true,
    },
    contracts2: {
      group:'lookup测试',
      type: 'lookup',
      label: '无reference_to/只读',
      multiple: true,
      options:[
        { label: '合同1', value: "1" },
        { label: '合同2', value: "2" },
        { label: '合同3', value: "3" },
      ],
    },
    contracts_reference_to_func: {
      reference_to:()=>{
        return 'contracts'
      },
      group:'lookup测试',
      type: 'lookup',
      label: '有reference_to为func',
      // multiple: true,
      // options:[
      //   { label: '合同1', value: "1" },
      //   { label: '合同2', value: "2" },
      //   { label: '合同3', value: "3" },
      // ],
    },
    populationType: {
      group: 'select测试',
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
        return [{label: '小孩', value: '2'}, {label: '婴儿', value: '1'}]
      },
      multiple: true,
    },
    populationTypeSingle: {
      group: 'select测试',
      type: 'select',
      label: '人群类型单选',
      // TODO:icon参数最后再加上测试（因为有点复杂）。
      options:[
        { label: '老人',  value:'1' },
        { label: '中年人', value: '2' },
        { label: '年轻人', value: '3' },
        { label: '孩童', value: '4' }
      ],
      multiple: false,
    },
    contracts_func_big: {
      reference_to: 'contract_types',
      type: 'lookup',
      label: '合同分类',
      group: "select测试",
      multiple: true,
    },
    contracts_func_small: {
      type: 'select',
      label: 'option is func',
      group: "select测试",
      depend_on: ["contracts_func_big"],
      optionsFunction: async (values: any) => {
        const data = await API.requestRecords('contracts', [["contract_type", "=", values.contracts_func_big]], ["_id",'name'], {'pageSize':'10'});
        const results = data.value.map((item: any) => {
            return {
                label: item.name,
                value: item['_id']
            }
        })
        return results;
      },
    },
    province: {
      type: 'select',
      label: '省',
      group: "省市级联",
      options:[
        { label: '北京', value: 'bj' },
        { label: '上海',   value:'sh' },
        { label: '江苏', value: 'js' }
      ]
    },
    city: {
      type: 'select',
      label: '市',
      group: "省市级联",
      depend_on: ["province"],
      optionsFunction:(values: any)=>{
        const cityData = {
          bj: [{ label: '东城区', value: 'bj-1' }, { label: '西城区', value: 'bj-2' }],
          sh: [{ label: '松江', value: 'sh-1' }, { label: '浦东', value: 'sh-2' }],
          js: [{ label: '南京', value: 'js-1' }, { label: '杭州', value: 'js-2' }],
        };
        return cityData[values.province]
      }
    },
    contracts_big: {
      type: 'lookup',
      label: '合同分类',
      group: "lookup联动",
      options: [
        { label: '一级合同', value: 'one' },
        { label: '二级合同', value: 'two' },
        { label: '三级合同', value: 'three' }
      ]
    },
    contracts_small: {
      type: 'lookup',
      label: '合同各类明细',
      group: "lookup联动",
      depend_on: ["contracts_big"],
      optionsFunction: (values: any) => {
        const smallData = {
          one : [{ label: '11合同', value: 'one-1' }, { label: '12合同', value: 'one-2' }],
          two : [{ label: '21合同', value: 'two-1' }, { label: '22合同', value: 'two-2' }],
          three: [{ label: '31合同', value: 'three-1' }, { label: '32合同', value: 'three-2' }],
        };
        return smallData[values.contracts_big]
      }
    },
    contracts_refeto_big: {
      reference_to: 'contract_types',
      type: 'lookup',
      label: '合同分类',
      group: "lookup联动有reference_to",
      multiple: true,
    },
    contracts_refeto_small: {
      reference_to: 'contracts',
      type: 'lookup',
      label: '合同',
      group: "lookup联动有reference_to",
      depend_on: ["contracts_refeto_big"],
      optionsFunction: async (values: any) => {
        const data = await API.requestRecords('contracts', [["contract_type", "=", values.contracts_refeto_big]], ["_id",'name'], {'pageSize':'10'});
        const results = data.value.map((item: any) => {
            return {
                label: item.name,
                value: item['_id']
            }
        })
        return results;
      }
    },
    contracts_re_big: {
      reference_to: 'contract_types',
      type: 'lookup',
      label: '1合同分类',
      group: "no reference_to func request",
      multiple: true,
    },
    contracts_re_small: {
      // reference_to: 'contracts',
      type: 'lookup',
      label: '1合同',
      group: "no reference_to func request",
      depend_on: ["contracts_re_big"],
      optionsFunction: async (values: any) => {
        const data = await API.requestRecords('contracts', [["contract_type", "=", values.contracts_re_big]], ["_id",'name'], {'pageSize':'10'});
        const results = data.value.map((item: any) => {
            return {
                label: item.name,
                value: item['_id']
            }
        })
        return results;
      }
    },
    orderNo: {
      reference_to: 'order',
      type: 'lookup',
      label: '订单',
      group: "lookup NAME_FIELD_KEY",
      multiple: true,
    },
    orders: {
      reference_to: 'order',
      type: 'lookup',
      label: '订单集',
      group: "lookup picker_schema",
      multiple: true,
      picker_schema: "all"
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
    contracts2:['1','2'],
    contractsNo:['2021-009'],
    populationType: ['1','2'],
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


export const Table = () => {
  return (
      <ObjectTable objectApiName='accounts' 
        pagination={{
          pageSize:3
        }}
        columnFields={
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
        }
      >
        
      </ObjectTable>
  )
}

export const TableFilters= () => {
  return (
      <ObjectTable objectApiName='tasks' 
        columnFields={
          [
            {
              fieldName: 'name'
            },
            {
              fieldName: 'priority'
            },
            {
              fieldName: 'related_to'
            }
          ]
        }
        // filters="(contains(tolower(name),'n'))"
        filters={[["name", "contains", "n"]]}
      >
        
      </ObjectTable>
  )
}

export const TableColumnRender= () => {
  return (
      <ObjectTable objectApiName='tasks' 
        columnFields={
          [
            {
              fieldName: 'name',
              render: (dom: any, record: any)=>{
                return (<Link to={`/app/-/tasks/view/${record._id}`} className="text-blue-600 hover:text-blue-500 hover:underline">{dom}</Link>);
              }
            },
            {
              fieldName: 'priority'
            },
            {
              fieldName: 'related_to'
            }
          ]
        }
      >
      </ObjectTable>
  )
}

export const Tree = () => {
  return (
      <ObjectTree objectApiName='organizations' nameField='name' parentField='parent'>
      </ObjectTree>
  )
}

export const ListView = () => {
  return (
      <ObjectListView objectApiName='accounts' 
        pagination={{
          pageSize:3
        }}
        listName="mine"
        // columnFields={
        //   [
        //     {
        //       fieldName: 'name'
        //     },
        //     {
        //       fieldName: 'parent_id'
        //     },
        //     {
        //       fieldName: 'created'
        //     },
        //     {
        //       fieldName: 'created_by'
        //     },
        //     // {
        //     //   fieldName: 'type'
        //     // },
        //     // {
        //     //   fieldName: 'rating'
        //     // }
        //   ]
        // }
      >
        
      </ObjectListView>
  )
}


export const ListViewNoSearch = () => {
  return (
      <ObjectListView objectApiName='tasks' 
        search={false}
      >
        
      </ObjectListView>
  )
}