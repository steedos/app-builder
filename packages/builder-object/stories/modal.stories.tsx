import { ObjectForm, ObjectField, Iframe } from "@steedos/builder-object";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"
import ReactDOM from "react-dom";
import { API } from '@steedos/builder-store';
import { Link } from "react-router-dom";
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
    </React.Fragment>
  )
}
