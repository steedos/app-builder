import React from "react"
import { SpaceUsers, SpaceUsersProps, ObjectModal, ObjectModalProps } from ".."
import { omit } from "lodash"

export type SpaceUsersModalProps = {
} & SpaceUsersProps & Omit<ObjectModalProps, 'contentComponent'>

export const SpaceUsersModal = ({
  ...rest
}: SpaceUsersModalProps) => {

  return (
    <ObjectModal
      contentComponent={SpaceUsers}
      {...omit(rest, ['contentComponent'])}
    />
  )
}
