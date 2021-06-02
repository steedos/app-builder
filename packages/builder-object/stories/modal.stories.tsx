import { ObjectForm, ObjectModal, ObjectTree, SpaceUsers, OrganizationsModal } from "@steedos/builder-object";
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
        window.SteedosUI.showModal(ObjectForm,{
          name: "showModal-test1", 
          ...schemaFormProps
        })
      }}>showModal - 弹出SchemaForm示例</Button>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        window.SteedosUI.showModal(ObjectForm,{
          name: "showModal-test2", 
          ...objectFormProps
        })
      }}>showModal - 弹出ObjectForm示例</Button>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        window.SteedosUI.showModal(ObjectForm,{
          name: "showModal-test3",
          recordId: "6k5svcTmfopo3dXWr",
          ...objectFormProps
        })
      }}>showModal - 弹出ObjectForm带recordId示例1</Button>
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        window.SteedosUI.showModal(ObjectForm,{
          name: "showModal-test3",
          recordId: "biJLkxf6bdi69dZJd",
          ...objectFormProps
        })
      }}>showModal - 弹出ObjectForm带recordId示例2</Button>
    </React.Fragment>
  )
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
  return (
    <React.Fragment>
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
      <Button type="primary" onClick={()=>{
        window.SteedosUI.showModal(ObjectModal,{
          name: "showModal-test1", 
          ...tableProps2,
          listSchema: {
            columns: ["name", "state"]
          },
        })
      }}>showModal - 弹出Table 指定列</Button>
    </React.Fragment>
  )
}

export const TreeModal = () => {
  const tableProps1 = {
    title: `选择 部门`,
    objectApiName: "organizations",
    contentComponent: ObjectTree,
    nameField:'name',
    parentField:'parent',
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  }
  const tableProps3 = {
    title: `选择 部门`,
    objectApiName: "organizations",
    onFinish: async (values)=>{
      console.log("values:", values);
      return true;
    }
  }
  return (
    <React.Fragment>
      <ObjectModal
        {...tableProps1}
        trigger={<Button type="primary" >弹出tree</Button>}
      />
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(ObjectModal,{
          name: "showModal-test1", 
          ...tableProps1,
        })
      }}>showModal  -  弹出Tree</Button>
      <br />
      <br />
      <OrganizationsModal
        {...tableProps3}
        trigger={<Button type="primary" >弹出tree 指定视图</Button>}
      />
      <br />
      <br />
      <Button type="primary" onClick={()=>{
        (window as any).SteedosUI.showModal(OrganizationsModal,{
          name: "showModal-test2", 
          ...tableProps3,
        })
      }}>showModal  -  弹出Tree 指定视图(含筛选条件) </Button>
    </React.Fragment>
  )
}