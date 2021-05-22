import { ObjectTable, ObjectTree, ObjectListView, ObjectExpandTable } from "@steedos/builder-object";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"
import { API } from '@steedos/builder-store';
import { Link } from "react-router-dom";
import { Modal, TreeSelect, Select, Input, Button } from "antd"
import ProCard from "@ant-design/pro-card"
import queryString from "querystring"
import { useEffect, useState } from "react";

export default {
  title: "Object Table",
}

export const Table = () => {
  return (
      <ObjectTable objectApiName='accounts' 
        pagination={{
          pageSize:3
        }}
        sort="created desc,name desc"
        // sort={[["created","desc"],["name","desc"]]}
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

export const ListViewToolbar = () => {
  return (
      <ObjectListView objectApiName='tasks' 
        search={false}
        toolbar={{
          actions: (<div>自定义按钮</div>)
        }}
      >
        
      </ObjectListView>
  )
}
