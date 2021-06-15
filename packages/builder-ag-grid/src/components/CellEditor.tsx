import React, { useContext, useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"
import _ from "lodash"
import ProField from "@ant-design/pro-field";

export const AgGridCellEditor = forwardRef((props: any, ref) => {
  const { 
    valueType = 'text',
    fieldSchema,
    context
  } = props;
  const editedMap: any= context.editedMap
  const [value, setValue] = useState(props.value);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
        getValue() {
            return value;
        },
        isPopup() {
          return false;
        }
    };
  });
  
  return (
    <section className="slds-popover slds-popover slds-popover_edit" role="dialog">
      <div className="slds-popover__body">
        <ProField 
          mode='edit'
          valueType={valueType} 
          value={value}
          onChange={(newValue)=>{

            if (newValue?.currentTarget)
              setValue(newValue?.currentTarget?.value)
            else
              setValue(newValue)

            if(!editedMap[props.data._id]){
              editedMap[props.data._id] = {};
            }
            editedMap[props.data._id][props.colDef.field] = newValue;
            
          }}
          fieldProps={{
            field_schema: fieldSchema
          }}
          allowClear={false}
          />
      </div>
    </section>
  ) 
});
  