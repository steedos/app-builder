import React, { useContext, useRef, useEffect, useState } from "react"
import { isFunction, forEach, isObject, filter, isString, each, includes, isBoolean, } from "lodash"
import { ObjectListViewProps, getListviewColumns, getListViewColumnFields, getListViewFilters } from "./"
import { ObjectGrid as ObjectExpandTable } from '@steedos/builder-ag-grid';
import { observer } from "mobx-react-lite"
import { Objects, API, Settings } from "@steedos/builder-store"

export const ObjectModalListView = observer((props: ObjectListViewProps<any>) => {
  let {
    objectApiName,
    listName = "all",
    columnFields,
    filters,
    listSchema,
    ...rest
  } = props
  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div>Loading object ...</div>)
  const schema = object.schema; 
  let listView = listSchema ? listSchema : schema.list_views[listName];
  const listViewColumns = listSchema && listSchema.columns ? listSchema.columns : getListviewColumns(schema, listName);
  if(!columnFields || columnFields.length==0){
    columnFields = getListViewColumnFields(listViewColumns, props, schema.NAME_FIELD_KEY);
  }
  if(!filters || filters.length==0){
    filters = getListViewFilters(listView, props);
  }

  return (
    <ObjectExpandTable
      objectApiName={objectApiName}
      columnFields={columnFields}
      filters={filters}
      // className={["object-listview", rest.className].join(" ")}
      {...rest}
    />
  )
})