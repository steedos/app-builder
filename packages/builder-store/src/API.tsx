

import { types, Instance, onSnapshot } from "mobx-state-tree";

import { SteedosClient } from '@steedos/builder-sdk';
import { convertFieldsSchema } from './utils';
import { Settings } from './Settings';

const client = new SteedosClient();

client.setUrl(Settings.rootUrl)
client.setUserId(Settings.userId)
client.setToken(Settings.authToken);
client.setSpaceId(Settings.tenantId);

onSnapshot(Settings, () => {
  client.setUrl(Settings.rootUrl)
  client.setUserId(Settings.userId)
  client.setToken(Settings.authToken);
  client.setSpaceId(Settings.tenantId);
})

const requestObject = async (objectApiName: string) => {
  //TODO 通过接口获取对象信息 /api/bootstrap/:spaceId/:objectName
  if (!objectApiName) {
    return;
  }
  const object = await client.sobject(objectApiName).getConfig();
  
  // TODO： 转换 object, grid 类型字段，生成 subFields 属性
  convertFieldsSchema(object);
  return object;
}

const requestRecords = async (objectApiName: string, filters: any, fields: any, options?: any) => {
  const records = await client.sobject(objectApiName).find(filters, fields, options);
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

export const API = {
  client,
  requestObject,
  requestRecords,
  updateRecord,
  insertRecord,
}