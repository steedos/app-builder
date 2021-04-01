import { ObjectForm } from "@steedos/builder-object";
import * as React from "react"
import { SteedosProvider } from "@steedos/builder-steedos"

export default {
  title: "Builder Object",
}

export const Form = () => {
  const objectApiName = 'space_users';
  const fields = []
  const recordId = '';
  const objectFormProps = {
    objectApiName,
    fields,
    recordId
  }
  return (
    <SteedosProvider>
      <ObjectForm {...objectFormProps}>
      </ObjectForm>
    </SteedosProvider>
  )
}