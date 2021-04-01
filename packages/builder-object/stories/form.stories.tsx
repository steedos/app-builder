import { ObjectForm } from "@steedos/builder-object/src/components/ObjectForm";
import * as React from "react"
import { SteedosProvider } from "@steedos/builder-steedos"

export default {
  title: "Builder Object",
}


export const Form = () => {
  const initialState = {
    currentObjectApiName: "accounts",
    currentRecordId:'111'
  }
  const providerProps = {
    initialState
  }
  return (
    <SteedosProvider {...providerProps}>
      <ObjectForm objectApiName='accounts' recordId='xBTfaMb7vXtxyXxrg'>
      </ObjectForm>
    </SteedosProvider>
  )
}