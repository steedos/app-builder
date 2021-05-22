import React from "react"
import { ObjectExpandTable, ObjectExpandTableProps } from ".."
import { observer } from "mobx-react-lite"
import { omit } from "lodash"

export type SpaceUsersProps = {
} & ObjectExpandTableProps

export const SpaceUsers = observer(({
  columnFields,
  ...rest
}: SpaceUsersProps) => {
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
      objectApiName="space_users"
      {...props}
      {...omit(rest, ['objectApiName'])}
    />
  )
});
