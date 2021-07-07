
import React, { useContext, useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { isEmpty, isNil, isArray, forEach } from "lodash"
import ProField from "@ant-design/pro-field";

import './CellFilter.less';

export const AgGridCellFilter = forwardRef((props:any, ref) => {
  const { 
    value: initialValue,
    valueType = 'text',
    depend_field_values = {},
    objectApiName,
    depended,
    fieldSchema,
  } = props;
  const [filter, setFilter] = useState(initialValue || null);
  const [dependFieldValues, setDependFieldValues] = useState(depend_field_values);
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
          },
          changeDependFieldValues(key, value){
            setDependFieldValues(Object.assign({}, dependFieldValues, {[key]: value}))
          }
      }
  });

  useEffect(() => {
    setDependFieldValues(dependFieldValues)
  }, [JSON.stringify(depend_field_values)]);

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
    let filterValue = value
    if(isEmpty(value)){  //由于select、lookup为多选且没有选择值时返回了空数组，此处需要转换为undefined。
      filterValue = undefined
    }else{
      // TODO: reference_to是数组并且多选时会报错，先暂时这样处理（不报错）。
      if(value.ids){
        filterValue = value.ids
      }
      else{
        filterValue = value
      }
    }
    setFilter(filterValue)
    if(depended && isArray(depended)){
      forEach(depended, (item)=>{
        try {
          props.api.getFilterInstance(item).componentInstance.changeDependFieldValues(fieldSchema.name, filterValue)
        } catch (error) {
          try {
            setTimeout(function(){
              props.api.getFilterInstance(item).componentInstance.changeDependFieldValues(fieldSchema.name, filterValue)
            }, 100)
          } catch (error) {
            
          }
        }
      })
    }
  }
  return (
    <div style={{padding:5}}>
      <ProField 
        mode='edit'
        valueType={valueType} 
        fieldProps={Object.assign({}, fieldProps, {depend_field_values: dependFieldValues})}
        onChange={onChange}
        text={initialValue}
        object_api_name={objectApiName}
        emptyText=''
      />
    </div>
  )
});