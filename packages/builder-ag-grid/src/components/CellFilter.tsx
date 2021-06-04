
import React, { useContext, useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { isEmpty, isNil } from "lodash"
import ProField from "@ant-design/pro-field";

import './CellFilter.less';

export const AgGridCellFilter = forwardRef((props:any, ref) => {
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
                type: 'equals',
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

  let fieldProps: any = {
    field_schema: Object.assign({}, fieldSchema, {multiple: true}),
  }
  if(!isNil(filter)){
    // filter为null时lookup显示会异常，所以加isNil
    fieldProps.value = filter;
  }

  const onChange = (value)=>{
    if(isEmpty(value)){  //由于select、lookup为多选且没有选择值时返回了空数组，此处需要转换为undefined。
      setFilter(undefined)
    }else{
      setFilter(value)
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