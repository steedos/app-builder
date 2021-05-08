
import React, { useContext, useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"
import _ from "lodash"
import ProField from "@ant-design/pro-field";

export const AgGridCellFilter = forwardRef((props:any, ref) => {
  const { 
    value: initialValue,
    valueType = 'text',
    fieldSchema,
  } = props;
  const [value, setValue] = useState(initialValue);

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => {
      return {
          // doesFilterPass(params) {
          // },

          // isFilterActive() {
          // },

          // this example isn't using getModel() and setModel(),
          // so safe to just leave these empty. don't do this in your code!!!
          getModel() {
            return {
              value,
            }
          },

          setModel() {
          }
      }
  });

  return (
    <div style={{padding:5}}>
      <ProField 
        mode='edit'
        valueType={valueType} 
        fieldProps={{
          field_schema: fieldSchema
        }}
        onChange={(value)=>{
          setValue(value)
        }}
        text={initialValue}
        emptyText=''
      />
    </div>
  )
});