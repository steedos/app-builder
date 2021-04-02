import { ObjectForm } from "@steedos/builder-object";
import * as React from "react"
import { SteedosProvider } from "@steedos/builder-steedos"

export default {
  title: "Builder Object",
}

export const Form = () => {
  const objectApiName = 'accounts';
  const fields = []
  const recordId = 'RBdciox55Niu5BueS';
  const objectFormProps = {
    objectApiName,
    fields,
    // recordId
  }
  return (
    <SteedosProvider>
      <ObjectForm {...objectFormProps}>
      </ObjectForm>
    </SteedosProvider>
  )
}