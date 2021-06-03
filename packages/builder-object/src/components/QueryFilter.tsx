import React, { useContext, useEffect, useState } from "react";
import * as PropTypes from 'prop-types';
import { forEach, defaults, groupBy, filter, map, defaultsDeep, isObject, isBoolean} from 'lodash';
import { Form } from '@steedos/builder-form';
import { ObjectField } from "./ObjectField";
import { ObjectForm, ObjectFormProps } from "./ObjectForm";
import { observer } from "mobx-react-lite"
import stores, { Objects, Forms, API, Settings } from '@steedos/builder-store';
import { Spin } from 'antd';
import { clone } from 'lodash';

export type QueryFilterProps = {
} & ObjectFormProps

export const QueryFilter = observer((props:QueryFilterProps) => {
  const {
    name: formId = 'query-filter-default',
    ...rest
  } = props;

  const onFinish = async(values:any) =>{
    console.log("values:", values);
  }

  return (
    <ObjectForm 
      name={formId}
      className='steedos-query-filter'
      mode="edit"
      onValuesChange={(changeValues: any)=>{
        console.log("changeValues:", changeValues);
      }}
      onFinish={onFinish}
      {...rest}
    />
  )
});