import { Builder } from '@builder.io/react';
import { Component, Input } from '@builder.io/sdk';
import { clone } from 'lodash';
import { ObjectProTable } from "./ObjectProTable";

export const configObjectTable: Component = {
  name: 'Steedos:ObjectProTable',
  inputs: [
    { name: 'objectApiName', type: 'text', friendlyName: "对象名" },
  ],
  canHaveChildren: false
};

export const registerObjectTableComponent = (fieldNames: string[] | { label: string; value: any; helperText?: string }[]) => {
  let configInputs: Input[] = clone(configObjectTable.inputs) as Input[];
  configInputs.push({
    name: 'columnFields', 
    type: 'list', 
    subFields: [
      { name: 'fieldName', type: 'string', enum: fieldNames, defaultValue: "name" },
      { name: 'wrap', type: 'boolean', defaultValue: false },
    ],
    helperText: '请选择要显示的列字段'
  });
  const config = Object.assign({}, configObjectTable, {inputs: configInputs});
  Builder.registerComponent(ObjectProTable, config);
}

