import React from 'react'
import { SteedosField } from './SteedosField';

export const text = (props) => {

  return (<SteedosField 
    valueType='text' 
    {...props}
    />)
}