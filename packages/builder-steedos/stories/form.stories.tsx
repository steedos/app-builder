import { ObjectForm } from "@steedos/builder-object/src/components/ObjectForm";
import * as React from "react"
import { SteedosProvider } from "../src"

export default {
  title: "Steedos Form",
}


export const FormTest = () => {
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