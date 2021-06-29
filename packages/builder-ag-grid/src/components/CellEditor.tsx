import React, { useContext, useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"
import _ from "lodash"
import ProField from "@ant-design/pro-field";

function getParentsClassName(element, classNames=[]){
  if(element){
    classNames.push(element.className)
    if(element.parentElement){
      classNames = classNames.concat(getParentsClassName(element.parentElement))
    }
  }
  return classNames
}

function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        console.log(`ref.current`, ref.current);
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        const parentsClassName = getParentsClassName(event.target)
        console.log(`event.target`, parentsClassName)
        if(parentsClassName.toString().indexOf('ant-modal-root') > -1 || parentsClassName.toString().indexOf('ant-select-dropdown') > -1){
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

export const AgGridCellEditor = forwardRef((props: any, ref) => {
  const { 
    valueType = 'text',
    fieldSchema,
    form,
    context
  } = props;
  const editedMap: any= context?.editedMap
  const [value, setValue] = useState(props.value);
  const fieldRef = useRef(null)
  const refEditor = useRef(null)
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

  useOnClickOutside(refEditor, (e) => {
    setTimeout(() => props.api.stopEditing(false), 100);
  });

  // const IntervalID = setInterval(()=>{
  //   console.log(`fieldRef.current`, document.activeElement, fieldRef.current.input)
  //   if(fieldRef.current && document.activeElement != fieldRef.current.input){
  //     props.api.stopEditing(false);
  //     clearInterval(IntervalID);
  //   }
  // }, 300)
  return (
    <section className="slds-popover slds-popover slds-popover_edit" role="dialog" ref={refEditor}>
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
            if(editedMap){
              if(!editedMap[props.data._id]){ 
                editedMap[props.data._id] = {};
              }
              editedMap[props.data._id][props.colDef.field] = newValue;
            }

            // if (['lookup','select','master_detail'].indexOf(valueType)>=0){
            //   setTimeout(() => props.api.stopEditing(false), 100);
            // }

            if(fieldSchema.multiple != true){
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
            }
            
          }}
          fieldProps={{
            _grid_row_id: props.data._id,
            field_schema: fieldSchema
          }}
          form={form}
          allowClear={false}
          />
      </div>
    </section>
  ) 
});
  