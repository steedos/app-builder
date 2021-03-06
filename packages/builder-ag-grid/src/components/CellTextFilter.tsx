
import React, { useContext, useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { isEmpty } from "lodash"
import ProField from "@ant-design/pro-field";

import './CellFilter.less';

export const AgGridCellTextFilter = forwardRef((props:any, ref) => {
  const { 
    value: initialValue,
    valueType = 'text',
    fieldSchema,
  } = props;
  const [filter, setFilter] = useState(initialValue || null);

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => {
      return {
          // doesFilterPass(params) {
          // },

          isFilterActive() {
            return !!filter
          },

          // this example isn't using getModel() and setModel(),
          // so safe to just leave these empty. don't do this in your code!!!
          getModel() {
            if (!!filter)
              return {
                filterType: valueType,
                type: 'contains',
                filter,
              }
          },

          setModel() {
          }
      }
  });

  useEffect(() => {
    if(filter !== null){
      props.filterChangedCallback()
    }
  }, [filter]);

  const fieldProps = {
    field_schema: Object.assign({}, fieldSchema, {multiple: true})
  }

  const onChange = (event)=>{
    if(isEmpty(event.target.value)){  //由于select、lookup为多选且没有选择值时返回了空数组，此处需要转换为undefined。
      setFilter(undefined)
    }else{
      setFilter(event.target.value)
    }
  }

  return (
    <div style={{padding:5}}>
      <ProField 
        mode='edit'
        valueType={valueType} 
        fieldProps={fieldProps}
        onChange={onChange}
        text={initialValue}
        emptyText=''
      />
    </div>
  )
});