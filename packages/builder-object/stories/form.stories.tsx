import { ObjectForm, ObjectField } from "@steedos/builder-object";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"
import { SteedosProvider } from "@steedos/builder-steedos"

export default {
  title: "Builder Object",
}

export const Form = () => {
  const objectApiName = 'accounts';
  const fields = []
  const recordId = 'RBdciox55Niu5BueS';
  const initialValues = {
    boolean__c: true,
    datetime__c: new Date(),
    autonumber__c: '2001-00001',
    percent__c: 0.55,
    name: 'xxx'
  };
  const objectFormProps = {
    objectApiName,
    fields,
    recordId,
    initialValues
  }
  return (
    <SteedosProvider>
      <ObjectForm {...objectFormProps}>
      </ObjectForm>
    </SteedosProvider>
  )
}


export const FormWithChildren = () => {
  const objectApiName = 'accounts';
  const fields = []
  const recordId = 'RBdciox55Niu5BueS';
  const objectFormProps = {
    objectApiName,
    fields,
    recordId,
  }
  return (
    <SteedosProvider>
      <ObjectForm {...objectFormProps}>
        <FieldSection title='Section'>
          {/* <ObjectField fieldName='name'/> */}
        </FieldSection> 
      </ObjectForm>
    </SteedosProvider>
  )
}