
import React from "react";
import { RequestData } from "@ant-design/pro-table";

export type RecordQueryRequestParams = {
  pageSize: number,
  current: number,
  sort: any
  // filter: any
} 

const defaultRequestObject = async ( objectApiName:string) =>{
  throw new Error(`requestObject ${objectApiName} failed, you should impl this function in ObjectProvider.`)
}

const defaultRequestRecords = async ( objectApiName:string, filters:any, fields:any, params?: RecordQueryRequestParams ) =>{
  throw new Error(`requestRecords ${objectApiName} failed, you should impl this function in ObjectProvider.`)
}

const defaultUpdateRecord = async (objectApiName:string, objectRecordId:string, formData:any) =>{
  throw new Error(`submitForm ${objectApiName} update id: ${objectRecordId} failed, you should impl this function in ObjectProvider.`)
}

const defaultInsertRecord = async (objectApiName:string, formData:any) =>{
  throw new Error(`submitForm ${objectApiName} add record failed, you should impl this function in ObjectProvider.`)
}

export type ObjectContextValueType = {
  currentObjectApiName?: string,
  currentRecordId?: string,
  queryClient?: any,
  requestObject: ( objectApiName:string) => Promise<object | Error>
  requestRecords: <T extends Record<string, any>>( objectApiName:string, filters:any, fields:any, params?: RecordQueryRequestParams ) => Promise<Partial<RequestData<T>>>
  updateRecord: (objectApiName:string, objectRecordId:string, formData:any ) => Promise<object | Error>
  insertRecord: (objectApiName:string, formData:any ) => Promise<object | Error>
}

export const ObjectContext = React.createContext<ObjectContextValueType>({
  requestObject: defaultRequestObject,
  requestRecords: defaultRequestRecords,
  updateRecord: defaultUpdateRecord,
  insertRecord: defaultInsertRecord
});
