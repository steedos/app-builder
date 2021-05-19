import React from 'react'
import { SteedosField } from './SteedosField';

export const date = (props) => {

  return (<SteedosField 
    valueType='date' 
    {...props}
    />)
}