
import React from "react";
import { observer } from "mobx-react-lite"
import _ from 'lodash';
import { Link as RouterLink } from "react-router-dom";

export const Link = observer((props:any) => {
  const {to, className, children, ...rest} = props
  if(window.Meteor){
      return (<a href={to} className={className}>{children}</a>)
  }
  return (
    <RouterLink to={to} className={className} {...rest}>{children}</RouterLink>
  )
});