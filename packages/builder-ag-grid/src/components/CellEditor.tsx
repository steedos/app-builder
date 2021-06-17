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
          return true;
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
          onChange={(element, value)=>{
            const newValue = (element?.currentTarget)? element.currentTarget.value: element
            if (newValue === props.value)
              return;

            setValue(newValue)

            if(!editedMap[props.data._id]){ 
              editedMap[props.data._id] = {};
            }
            editedMap[props.data._id][props.colDef.field] = newValue;

            // if (['lookup','select','master_detail'].indexOf(valueType)>=0){
            //   setTimeout(() => props.api.stopEditing(false), 100);
            // }
            if(!element?.target || document.activeElement != element.target){
              setTimeout(() => props.api.stopEditing(false), 100);
            }

            if(element?.target && document.activeElement === element.target){
              
              const IntervalID = setInterval(()=>{
                if(document.activeElement != element.target){
                  props.api.stopEditing(false);
                  clearInterval(IntervalID);
                }
              }, 300)
            }
            
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
  