import { ObjectForm, ObjectField, ObjectTable } from "@steedos/builder-object";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"
import { SteedosProvider } from "@steedos/builder-steedos"

export default {
  title: "Builder Object",
}

export const Form = () => {
  const objectApiName = 'accounts';
  const fields = {
    grid: {
      type: 'grid',
      label: 'grid',
      group: 'grid',
      is_wide: true,
      sub_fields: {
        col1: {
          type: 'text'
        },
        col2: {
          type: 'boolean'
        },
      }
    },
    test: {
      type: 'text'
    },
    object: {
      type: 'object',
      label: 'object',
      group: 'object',
      is_wide: true,
      sub_fields: {
        sub1: {
          type: 'text'
        },
        sub2: {
          type: 'boolean'
        },
      }
    }
  }
  const recordId = 'RBdciox55Niu5BueS';
  const initialValues = {
    boolean__c: true,
    datetime__c: new Date(),
    autonumber__c: '2001-00001',
    percent__c: 0.55,
    name: 'xxx',
    grid: [{
      col1: '111',
      col2: true,
    }, {
      col1: '222',
      col2: true,
    }],
    object: {
      sub1: 'sub1',
      sub2: true,
    }
  };
  const objectFormProps = {
    objectApiName,
    fields,
    recordId,
    initialValues,
    mode: 'read',
    layout: 'horizontal' 
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
  const nameFieldSchema = {
    type: 'text',
    name: 'name',
    label: 'Name'
  }
  return (
    <SteedosProvider>
      <ObjectForm {...objectFormProps}>
        <FieldSection title='Section'>
          <ObjectField objectApiName={objectApiName} fieldName='name' fieldSchema={nameFieldSchema}/>
          {/* <span>111</span> */}
        </FieldSection> 
      </ObjectForm>
    </SteedosProvider>
  )
}


export const Table = () => {
  return (
    <SteedosProvider>
      <ObjectTable objectApiName='accounts' columnFields={
        [
          {
            fieldName: 'name'
          },
          // {
          //   fieldName: 'parent_id'
          // },
          // {
          //   fieldName: 'type'
          // },
          // {
          //   fieldName: 'rating'
          // }
        ]
      }>
        
      </ObjectTable>
    </SteedosProvider>
  )
}