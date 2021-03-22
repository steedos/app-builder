import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ObjectContext, ObjectContextValueType, RecordQueryRequestParams } from "./ObjectContext";

/* 通过 valueTypeMap，支持给Form传入第三方自定义控件 */
type ObjectProviderProps = ObjectContextValueType & {
  children: any,
}

export function ObjectProvider(props: ObjectProviderProps) {

  const {
    currentObjectApiName,
    currentRecordId,
    requestObject,
    requestRecords,
    updateRecord,
    addNewRecord,
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
      addNewRecord
    }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ObjectContext.Provider>
  )
}