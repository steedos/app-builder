import { ObjectForm, ObjectModal, ObjectTree, SpaceUsers, OrganizationsModal, SpaceUsersModal, Organizations, ObjectTable } from "@steedos/builder-object";
import * as React from "react"
import ReactDOM from "react-dom";
import { Modal, TreeSelect, Select, Input, Button } from "antd"

export default {
  title: "Object Modal",
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
    // recordId: process.env.STEEDOS_CURRENT_RECORD_ID,
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
        (window as any).SteedosUI.showModal(ObjectForm,{
          ...schemaFormProps
        })
      }}>showModal - 弹出SchemaForm示例</Button>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(ObjectForm,{
          ...objectFormProps
        })
      }}>showModal - 弹出ObjectForm示例</Button>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(ObjectForm,{
          recordId: "6k5svcTmfopo3dXWr",
          ...objectFormProps
        })
      }}>showModal - 弹出ObjectForm带recordId示例1</Button>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(ObjectForm,{
          recordId: "biJLkxf6bdi69dZJd",
          ...objectFormProps
        })
      }}>showModal - 弹出ObjectForm带recordId示例2</Button>
    </React.Fragment>
  )
}

const getSchemaTalbeProps = ()=>{
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
  const objectSchema={
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
  };
  const listSchema={
    columns:[
      {
        field: 'name',
        width: '300'
      },
      {
        field: 'tags'
      },
      {
        field: 'contract'
      }
    ]
  };
  return {
    title: `选择 数据`,
    objectSchema,
    listSchema,
    rows,
    selectedRowKeys:["2"],
    onFinish: async (values, rows)=>{
      console.log("values:", values, rows);
      return true;
    }
  }
}

export const TableModal = () => {
  const tableProps1 = {
    title: `选择 任务`,
    objectApiName: "tasks",
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  }
  const tableProps2 = {
    title: `选择 任务`,
    objectApiName: "tasks",
    // sort:[['state','desc']],
    sort:[{field_name: "state",order: "desc"}],
    listSchema: {
      columns: ["name", "assignees", "related_to"]
    },
    multiple: true,
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  };
  const tableProps3 = {
    title: `选择 任务`,
    objectApiName: "tasks",
    listSchema: "my_open_tasks",
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  };
  const tableProps4 = {
    title: `选择 人员`,
    objectApiName: "space_users",
    // listSchema: "all",
    columnFields:[{
      fieldName: "name",
      hideInSearch: true,
      sorter: true,
    },{
      fieldName: "email",
      hideInSearch: true,
    },{
      fieldName: "mobile",
      hideInSearch: true,
    },{
      fieldName: "organizations_parents",
      hideInTable: true,
      hideInSearch: true,
      expandComponent: ObjectTree,
      expandNameField: "name",
    }],
    // filters:['name','contains','芳'],
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  };
  const tableProps5 = {
    title: `选择 人员`,
    // filters:['name','contains','芳'],
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  };
  return (
    <React.Fragment>
      <ObjectModal
        {...getSchemaTalbeProps()}
        trigger={<Button type="primary" >弹出Schema Table</Button>}
      />
      <br />
      <br />
      <ObjectModal
        {...tableProps1}
        trigger={<Button type="primary" >弹出Table 默认使用all视图配置</Button>}
      />
      <br />
      <br />
      <ObjectModal 
        {...tableProps2}
        trigger={<Button type="primary" >弹出Table 指定列</Button>}
      />
      <br />
      <br />
      <ObjectModal 
        {...tableProps3}
        trigger={<Button type="primary" >弹出Table 指定视图</Button>}
      />
      <br />
      <br />
      <ObjectModal 
        {...tableProps4}
        trigger={<Button type="primary" >弹出包含左侧树的表格</Button>}
      />
      <br />
      <br />
      <SpaceUsersModal 
        {...tableProps5}
        trigger={<Button type="primary" >弹出选人</Button>}
      />
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(ObjectTable,getSchemaTalbeProps())
      }}>showModal - 弹出Schema Table</Button>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(ObjectTable,{
          ...tableProps2,
          listSchema: {
            columns: ["name", "state"]
          },
        })
      }}>showModal - 弹出Table 指定列</Button>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(ObjectTable,{
          ...tableProps4
        })
      }}>showModal - 弹出包含左侧树的表格</Button>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(SpaceUsers,{
          ...tableProps5
        })
      }}>showModal - 弹出选人</Button>
    </React.Fragment>
  )
}

export const TreeModal = () => {
  const treeProps1 = {
    title: `选择 部门`,
    objectApiName: "organizations",
    contentComponent: ObjectTree,
    nameField: "name",
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  }
  const treeProps2 = {
    title: `选择 部门`,
    objectApiName: "organizations",
    contentComponent: ObjectTree,
    nameField: "name",
    // filters:['name','contains','公司'],
    filters: "contains(name,'公司')",
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  }
  const treeProps3 = {
    title: `选择 部门`,
    objectApiName: "organizations",
    contentComponent: ObjectTree,
    nameField: "name",
    multiple: true,
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  }
  const treeProps4 = {
    title: `选择 部门`,
    objectApiName: "organizations",
    // filters:['name','contains','公司'],
    // filters: "contains(name,'公司')",
    // multiple: true,
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  }
  return (
    <React.Fragment>
      <ObjectModal
        {...treeProps1}
        trigger={<Button type="primary" >弹出tree</Button>}
      />
      <br /><br />
      <ObjectModal
        {...treeProps2}
        trigger={<Button type="primary" >弹出tree + filters</Button>}
      />
      <br /><br />
      <ObjectModal
        {...treeProps3}
        trigger={<Button type="primary" >弹出tree + multiple</Button>}
      />
      <br /><br />
      <OrganizationsModal
        {...treeProps4}
        trigger={<Button type="primary" >弹出选组</Button>}
      />
      <br /><br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(ObjectTree,{
          name: "showModal-test1", 
          ...treeProps1,
        })
      }}>showModal  -  弹出Tree</Button>
      <br /><br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(Organizations,{
          name: "showModal-test2", 
          ...treeProps4,
        })
      }}>showModal  -  弹出选组</Button>
    </React.Fragment>
  )
}