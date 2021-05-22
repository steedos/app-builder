import React from "react"
import { ObjectExpandTable, ObjectExpandTableProps } from ".."
import { observer } from "mobx-react-lite"
import { omit } from "lodash"

export type OrganizationsProps = {
} & ObjectExpandTableProps

export const Organizations = observer(({
  columnFields,
  ...rest
}: OrganizationsProps) => {
  let props = {
    columnFields
  };
  if(!props.columnFields){
    props.columnFields = [{
      fieldName: "name",
      hideInSearch: true,
      sorter: true,
    },{
      fieldName: "email",
      hideInSearch: true,
    }]
  }
  return (
    <ObjectExpandTable
      objectApiName="organizations"
      {...props}
      {...omit(rest, ['objectApiName'])}
    />
  )
});
