import * as React from "react"
import { Form,Field } from '@steedos/builder-form';
import { FilterForm } from "@steedos/builder-object";

export default {
  title: "Filter",
}

export const ObjectFilter = () => {
  return (
      <FilterForm
       objectApiName={"accounts"}
       fields={["name"]}
      />
  )
}

export const SchemaFilter = () => {
  return (
      <FilterForm
       objectSchema={{
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
       }}
      />
  )
}