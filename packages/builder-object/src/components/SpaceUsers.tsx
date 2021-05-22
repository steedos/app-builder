import React from "react"
import { ObjectExpandTable, ObjectExpandTableProps } from ".."
import { omit } from "lodash"

export type SpaceUsersProps = {
} & ObjectExpandTableProps

export const SpaceUsers = ({
  ...rest
}: SpaceUsersProps) => {
  return (
    <ObjectExpandTable
      objectApiName="space_users"
      columnFields={["name"]}
    />
  )
}
