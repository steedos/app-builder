import React from "react"
import { ObjectTable, ObjectModal, ObjectModalProps } from ".."
import { omit } from "lodash"

export type ObjectTableModalProps = {
} & Omit<ObjectModalProps, 'contentComponent'>

export const ObjectTableModal = ({
  ...rest
}: ObjectTableModalProps) => {

  return (
    <ObjectModal
      contentComponent={ObjectTable}
      {...omit(rest, ['contentComponent'])}
    />
  )
}
