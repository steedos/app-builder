import { ObjectForm } from "@steedos/builder-object/src/components/ObjectForm";
import * as React from "react"
import { SteedosProvider } from "../src"

export default {
  title: "Steedos Form",
}


export const FormTest = () => {

  const rootUrl = 'http://localhost:5000';
  const tenantId = '';
  const userId = '';
  const authToken = '';

  const initialState = {
    currentObjectApiName: "accounts",
    currentRecordId:'111'
  }
  const providerProps = {
    rootUrl,
    tenantId,
    userId,
    authToken,
    initialState
  }
  return (
    <SteedosProvider {...providerProps}>
      <ObjectForm objectApiName='accounts' recordId='111'>
      </ObjectForm>
    </SteedosProvider>
  )
}