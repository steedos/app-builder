import React, { useContext, useRef, useEffect, useState } from "react"
import { isFunction, forEach, isObject, filter, isString, each, includes, isBoolean, } from "lodash"
import { ObjectListViewProps, getListviewColumns, getListViewColumnFields, getListViewFilters } from "."
import { ObjectExpandTable } from "."
import { observer } from "mobx-react-lite"
import { Objects, API, Settings } from "@steedos/builder-store"
import { ObjectGrid, ObjectTreeGrid } from '@steedos/builder-ag-grid';

export const ObjectTable = observer((props: ObjectListViewProps<any>) => {
  console.log("===ObjectTable===props==", props);
  let {
    objectApiName,
    listName = "all",
    columnFields,
    filters,
    listSchema,
    ...rest
  } = props
  const object = objectApiName && Objects.getObject(objectApiName);
  if (object?.isLoading) return (<div>Loading object ...</div>)
  const schema = rest.objectSchema || object?.schema;
  let listView = listSchema ? listSchema : schema?.list_views[listName];
  if(!columnFields || columnFields.length==0){
    const listViewColumns = listSchema && listSchema.columns ? listSchema.columns : getListviewColumns(schema, listName);
    columnFields = getListViewColumnFields(listViewColumns, props, schema.NAME_FIELD_KEY);
  }
  if(!filters || filters.length==0){
    filters = listView && getListViewFilters(listView, props);
  }
  let TableComponent = ObjectGrid;
  if(schema.enable_tree){
    TableComponent = ObjectTreeGrid;
  }

  return (
    <ObjectExpandTable
      objectApiName={objectApiName}
      columnFields={columnFields}
      filters={filters}
      tableComponent={TableComponent}
      // className={["object-listview", rest.className].join(" ")}
      {...rest}
    />
  )
})