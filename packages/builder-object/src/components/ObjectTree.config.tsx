import { Builder } from '@builder.io/react';
import { Component, Input } from '@builder.io/sdk';
import _ from 'lodash';
import { ObjectTree } from "./ObjectTree";

export const configObjectTree: Component = {
  name: 'Steedos:ObjectTree',
  inputs: [
    { name: 'objectApiName', type: 'text', friendlyName: "对象名" },
  ],
  canHaveChildren: false
};

export const registerObjectTreeComponent = (fieldNames: string[] ) => {
  let configInputs: Input[] = _.clone(configObjectTree.inputs) as Input[];
  configInputs.unshift({
    name: 'fieldName', 
    type: 'string', 
    enum: fieldNames,
    helperText: '请选择字段名'
  });

  const config = Object.assign({}, configObjectTree, {inputs: configInputs});
  Builder.registerComponent(ObjectTree, config);
}

