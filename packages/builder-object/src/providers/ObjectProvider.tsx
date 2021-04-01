import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ObjectContext, ObjectContextValueType, RecordQueryRequestParams } from "./ObjectContext";
import { FormProvider } from "@steedos/builder-form";
import {valueTypes} from '../valueTypes'

/* 通过 valueTypeMap，支持给Form传入第三方自定义控件 */
type ObjectProviderProps = ObjectContextValueType & {
  children: any,
}

export function ObjectProvider(props: ObjectProviderProps) {

  const {
    locale,
    currentObjectApiName,
    currentRecordId,
    requestObject,
    requestRecords,
    updateRecord,
    insertRecord,
    queryClient = new QueryClient(),
    children,
  } = props;

  return (
    <ObjectContext.Provider value={{
      currentObjectApiName,
      currentRecordId,
      queryClient,
      requestObject,
      requestRecords,
      updateRecord,
      insertRecord
    }}>
      <QueryClientProvider client={queryClient}>
        <FormProvider locale={locale} valueTypeMap={valueTypes}>
          {children}
        </FormProvider>
      </QueryClientProvider>
    </ObjectContext.Provider>
  )
}