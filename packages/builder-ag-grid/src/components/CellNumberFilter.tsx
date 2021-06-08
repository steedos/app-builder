
import React, { useContext, useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { isEmpty } from "lodash"
import ProField from "@ant-design/pro-field";
import { getBetweenTimeBuiltinValueItem } from "@steedos/filters";

import './CellFilter.less';

export const AgGridCellNumberFilter = forwardRef((props:any, ref) => {
  const { 
    value: initialValue,
    valueType = 'text',
    fieldSchema,
  } = props;
  const [numberFrom, setNumberFrom] = useState(initialValue || null);
  const [numberTo, setNumberTo] = useState(initialValue || null);

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => {
      return {
          // doesFilterPass(params) {
          // },

          isFilterActive() {
            return !!numberTo || !!numberFrom
          },

          // this example isn't using getModel() and setModel(),
          // so safe to just leave these empty. don't do this in your code!!!
          getModel() {
            if ((!!numberTo || !!numberFrom))
            return {
              filterType: "number",
              type: 'between',
              numberFrom: numberFrom,
              numberTo: numberTo
            }
          },

          setModel() {
          }
      }
  });

  useEffect(() => {
    if(numberTo !== null || numberFrom !== null){
      props.filterChangedCallback()
    }
  }, [numberTo, numberFrom]);

  const startFieldProps = {
    field_schema: fieldSchema,
    placeholder: '开始'
  }
  const endFieldProps = {
    field_schema: fieldSchema,
    placeholder: '结束'
  }
  return (
    <div style={{padding:5}}>
      <ProField
          mode='edit'
          valueType={valueType}
          fieldProps={startFieldProps}
          onChange={(value) => {
            if(value === null){
              setNumberFrom(undefined);
            }else{
              setNumberFrom(value)
            }
          }}
          text={initialValue}
          emptyText=''
        />
        <ProField
          mode='edit'
          valueType={valueType}
          fieldProps={endFieldProps}
          onChange={(value) => {
            if(value === null){
              setNumberTo(undefined);
            }else{
              setNumberTo(value)
            }
          }}
          text={initialValue}
          emptyText=''
        />
      
    </div>
  )
});