import React from "react"
import { SpaceUsers, SpaceUsersProps, ObjectModal, ObjectModalProps } from ".."
import { omit } from "lodash"

export type SpaceUsersModalProps = {
} & SpaceUsersProps & Omit<ObjectModalProps, 'contentComponent'>

export const SpaceUsersModal = ({
  columnFields,
  ...rest
}: SpaceUsersModalProps) => {
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
    },{
      fieldName: "user",
      hideInSearch: true,
      hideInTable: true,
    }]
  }
  return (
    <ObjectModal
      contentComponent={SpaceUsers}
      {...props}
      {...omit(rest, ['objectApiName', 'contentComponent'])}
    />
  )
}
