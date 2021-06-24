import { ObjectGrid, ObjectTreeGrid } from "@steedos/builder-ag-grid";
import * as React from "react"
export default {
  title: "Object Table AG Grid",
}

export const Grid = () => {
  return (
    <div style={{height:'500px'}}>
      <ObjectGrid objectApiName='accounts' 
        selectedRowKeys={["6k5svcTmfopo3dXWr"]}
        pagination={true}
        sort="created desc,name desc"
        // rowSelection="single"
        columnFields={
          [
            {
              fieldName: 'name',
              width: '200'
            },
            {
              fieldName: 'description'
            },
            {
              fieldName: 'parent_id'
            },
            {
              fieldName: 'rating'
            },
            {
              fieldName: 'type'
            },
            {
              fieldName: 'created'
            },
            {
              fieldName: 'created_by'
            },
          ]
        }
      >
      </ObjectGrid>
    </div>
  )
}

export const TreeGrid = () => {
  return (
    <div style={{height:'500px'}}>
      <ObjectTreeGrid objectApiName='organizations' 
        // pagination={false}
        sort="created desc,name desc"
        // rowSelection="single"
        columnFields={
          [
            {
              fieldName: 'name',
              hideInTable: true,
              width: 240
            },
            // {
            //   fieldName: 'parent',
            //   hideInTable: true
            // },
            {
              fieldName: 'created',
              width: 300
            },
            {
              fieldName: 'created_by'
            },
          ]
        }
      >
      </ObjectTreeGrid>
    </div>
  )
}


export const SchemaGrid = () => {
  const rows = [{
    _id:"1", 
    name:"A", 
    tags:["1"], 
    contract:"C25heacKZD9uy2EAj"
  },{
    _id:"2", 
    name:"B", 
    tags:["2"], 
    contract:"C25heacKZD9uy2EAj"
  },{
    _id:"3", 
    name:"C", 
    tags:["1", "2"], 
  }];
  return (
    <div style={{height:'500px'}}>
      <ObjectGrid
        rows={rows}
        selectedRowKeys={["2"]}
        columnFields={
          [
            {
              fieldName: 'name',
              width: '200'
            },
            {
              fieldName: 'tags'
            },
            {
              fieldName: 'contract'
            }
          ]
        }
        objectSchema={{
          fields:{
            name: {
              type: 'text',
              label: '名称',
            },
            tags: {
              type: 'select',
              label: '标签',
              options:[
                { label: '老人',   value:'1' },
                { label: '中年人', value: '2' },
                { label: '年轻人', value: '3' },
                { label: '孩童', value: '4' }
              ],
              multiple: true
            },
            contract: {
              reference_to: 'contracts',
              type: 'lookup',
              label: '合同'
            },
          }
        }}
      />
    </div>
  )
}