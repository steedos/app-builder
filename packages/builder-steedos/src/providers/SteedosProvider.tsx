
import React from "react";

import { SteedosClient } from '@steedos/client';
import { SteedosContext } from '..';
import { ObjectProvider } from "@steedos/builder-object";
import { FormProvider } from "@steedos/builder-form";
import { StoreProvider } from "@steedos/builder-store";
import { valueTypes } from "@steedos/builder-object";

const {
  STEEDOS_ROOT_URL,
  STEEDOS_TENANT_ID,
  STEEDOS_USER_ID,
  STEEDOS_AUTH_TOKEN,
  STEEDOS_LOCALE = 'zh_CN'
} = process.env

/*
参数：
- locale: zh_CN, en_US, zh_TW  TODO: 和steedos的locale值不一样，获取user之后需要转换。

*/
export function SteedosProvider(props: any) {

  const {
    rootUrl = STEEDOS_ROOT_URL,
    tenantId = STEEDOS_TENANT_ID,
    userId = STEEDOS_USER_ID,
    authToken = STEEDOS_AUTH_TOKEN,
    user = {},
    locale = STEEDOS_LOCALE,
    children,
  } = props;

  let initialState = props.initialState ? props.initialState : {};

  const client = new SteedosClient();

  client.setUrl(rootUrl)
  client.setUserId(userId)
  client.setToken(authToken);
  client.setSpaceId(tenantId);

  const steedosContextValues = {
    rootUrl,
    tenantId,
    userId,
    authToken,
    user,
    locale,
    client,
  }

  const requestObject = async (objectApiName: string) => {
    //TODO 通过接口获取对象信息 /api/bootstrap/:spaceId/:objectName
    if (!objectApiName) {
      return;
    }
    const object = await client.sobject(objectApiName).getConfig();
    return object;
  }

  const requestRecords = async (objectApiName: string, filters: any, fields: any, options: any) => {
    const records = await client.sobject(objectApiName).find(filters, fields);
    return records;

  }

  const updateRecord = async (objectApiName: string, objectRecordId: string, data: any) => {
    const result = await client.sobject(objectApiName).update(objectRecordId, data);

    return result;
  }

  const insertRecord = async (objectApiName: string, data: any) => {
    const result = await client.sobject(objectApiName).insert(data);
    return result;
  }

  const objectProviderProps = {
    requestObject,
    requestRecords,
    updateRecord,
    insertRecord
  }

  return (
    <StoreProvider initialState={initialState}>
      <SteedosContext.Provider value={steedosContextValues}>
        <ObjectProvider {...objectProviderProps}>
          <FormProvider locale={locale} valueTypeMap={valueTypes}>
            {children}
          </FormProvider>
        </ObjectProvider>
      </SteedosContext.Provider>
    </StoreProvider>
  )
}