
import React, { useContext, useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"
import _ from "lodash"
import ProField from "@ant-design/pro-field";

export const AgGridCellRenderer = (props: any) => {
  const { 
    value, 
    valueType = 'text',
    render,
    fieldSchema,
    data,
  } = props;

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
