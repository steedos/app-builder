import { Builder } from "@builder.io/react"
import { Component, Input } from "@builder.io/sdk"
import _ from "lodash"
import { ObjectList } from "./ObjectList"

export const configObjectList: Component = {
  name: "Steedos:ObjectList",
  inputs: [{ name: "objectApiName", type: "text", friendlyName: "对象名" }],
  canHaveChildren: false,
}

export const registerObjectListComponent = (fieldNames: string[]) => {
  let configInputs: Input[] = _.clone(configObjectList.inputs) as Input[]
  configInputs.unshift({
    name: "fieldName",
    type: "string",
    enum: fieldNames,
    helperText: "请选择字段名",
  })

  const config = Object.assign({}, configObjectList, { inputs: configInputs })
  Builder.registerComponent(ObjectList, config)
}
