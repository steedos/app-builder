import React, { useContext, useEffect, useState } from "react";
import * as PropTypes from 'prop-types';
import { forEach, defaults, groupBy, filter, map, defaultsDeep, isObject, isBoolean} from 'lodash';
import { convertFormToFilters } from '@steedos/builder-sdk';
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
    objectApiName,
    fields = [],
    objectSchema = {},
    ...rest
  } = props;


  const object = objectApiName? Objects.getObject(objectApiName): null;
  if (object && object.isLoading) return (<div><Spin/></div>)

  
  const mergedSchema = object? defaultsDeep({}, object.schema, objectSchema): objectSchema;
  const form = stores.Forms.loadById(formId);
  // form.setSchema(mergedSchema);


  const onValuesChange = async (changeValues: any) =>{
    console.log("changeValues:", changeValues);
    let newValue = Object.assign({}, form.value || {}, changeValues);
    form.setValue(newValue);
    const filters = convertFormToFilters(mergedSchema, newValue);
    form.setConvertedFilters(filters);
  }

  const onFinish = async(values:any) =>{
    console.log("values:", values);
  }

  return (
    <ObjectForm 
      objectApiName={objectApiName}
      fields={fields}
      objectSchema={objectSchema}
      name={formId}
      className='steedos-query-filter'
      mode="edit"
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      submitter={false}
      {...rest}
    />
  )
});