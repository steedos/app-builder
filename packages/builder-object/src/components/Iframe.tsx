
import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite"
import * as PropTypes from 'prop-types';
import _ from 'lodash';

export const Iframe = observer((props:any) => {
  return (
    <iframe {...props}/>
  )
});