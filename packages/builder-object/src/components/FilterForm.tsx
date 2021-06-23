import React, { useContext, useEffect, useState } from "react";
import * as PropTypes from 'prop-types';
import { forEach, defaults, groupBy, filter, map, defaultsDeep, isObject, isBoolean} from 'lodash';
import { convertFormToFilters, getFilterFormSchema } from '@steedos/builder-sdk';
import { ObjectField } from "./ObjectField";
import { ObjectForm, ObjectFormProps } from "./ObjectForm";
import { observer } from "mobx-react-lite"
import stores, { Objects, Forms, API, Settings } from '@steedos/builder-store';
import { Spin } from 'antd';
import { clone } from 'lodash';

export type FilterFormProps = {
} & ObjectFormProps

export const FilterForm = observer((props:FilterFormProps) => {
  const {
    name: formId = 'filter-form-default',
    objectApiName,
    fields,
    objectSchema = {},
    ...rest
  } = props;


  const object = objectApiName? Objects.getObject(objectApiName): null;
  if (object && object.isLoading) return (<div><Spin/></div>)

  
  const mergedSchema = object? defaultsDeep({}, object.schema, objectSchema): objectSchema;
  const filterFormSchema = getFilterFormSchema(mergedSchema, fields);
  const form = stores.Forms.loadById(formId);
  // form.setSchema(mergedSchema);


  const onValuesChange = async ({changedValues, values}) =>{
    console.log("changedValues:", changedValues);
    let newValue = Object.assign({}, form.value || {}, changedValues);
    form.setValue(newValue);
    const filters = convertFormToFilters(filterFormSchema, newValue);
    // console.log("==FilterForm===filters===", filters);
    form.setConvertedFilters(filters);
  }

  const onFinish = async(values:any) =>{
    console.log("values:", values);
  }

  return (
    <ObjectForm 
      objectApiName={objectApiName}
      fields={fields}
      objectSchema={filterFormSchema}
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