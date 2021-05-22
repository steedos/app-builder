import React from "react"
import { ObjectTree, ObjectTreeProps } from ".."
import { observer } from "mobx-react-lite"
import { omit } from "lodash"

export type OrganizationsProps = {
} & ObjectTreeProps

export const Organizations = observer(({
  columnFields,
  ...rest
}: OrganizationsProps) => {
  let props = {
    objectApiName: "organizations",
    nameField: "name",
    parentField: "parent",
    // releatedColumnField: "organizations_parents",
    // filters: expandDefine.expandFilters
  };
  return (
    <ObjectTree
      {...props}
      {...omit(rest, ['objectApiName'])}
    />
  )
});
