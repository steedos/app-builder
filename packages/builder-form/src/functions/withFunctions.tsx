import { forEach, cloneDeep } from 'lodash';
import React from 'react'
import { Builder, BuilderComponent, builder, withChildren } from '@builder.io/react';


export function withFunctions(Component:any, functionNames: string[]) {
  return (props:any) => {
    let {initialValues, onFinish, onValuesChange, children, ...rest} = props
    let newProps = cloneDeep(props)

    // 确保函数在编辑状态下无效，以避免编辑工具一直报错。
    forEach(functionNames, (name)=>{
      if (typeof props[name] === 'string'){
        if (Builder.isEditing) {
          try {
            newProps[name] = eval(props[name])
          } catch(e) {console.log(e)}
        } 
        else {
          try {
            newProps[name] = eval(props[name])
          } catch(e) {console.log(e)}
        }
      }
    })

    return <Component {...newProps}/>
  }
}