export const configObjectForm = {
  name: 'Steedos:ObjectForm',
  inputs: [
    { name: 'objectApiName', type: 'text', friendlyName: "对象名" },
    { name: 'recordId', type: 'text', friendlyName: "记录ID" },
    { name: 'mode', type: 'text', friendlyName: "Mode", defaultValue: "edit" }, 
    { name: 'editable', type: 'text', friendlyName: "Editable" }
  ],
  canHaveChildren: true
};
