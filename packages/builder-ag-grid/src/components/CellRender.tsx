import React from "react"
import {has} from "lodash"
import ProField from "@ant-design/pro-field";

export const AgGridCellRenderer = (props: any) => {
  const { 
    value, 
    valueType = 'text',
    render,
    fieldSchema,
    data,
    context,
  } = props;
  const editedMap: any= context?.editedMap
  if(editedMap){
    const recordEdited = editedMap[data._id];
    if(recordEdited && has(recordEdited, props.colDef.field) && props.eGridCell.className.indexOf("slds-is-edited") < 0){
      props.eGridCell.className = props.eGridCell.className + ' slds-is-edited'
    }
  }

  let _render = null;

  if(render){
    _render = (dom)=>{
      return render(dom, data)
    }
  }
  return (
    
    <ProField 
      mode='read'
      render = {_render}
      valueType={valueType} 
      fieldProps={{
        field_schema: fieldSchema
      }}
      text={value}
      emptyText=''
      />
  ) 
}
