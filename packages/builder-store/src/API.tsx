

import { types, Instance, onSnapshot } from "mobx-state-tree";

import { SteedosClient } from '@steedos/builder-sdk';
import { convertFieldsSchema } from './utils';
import { Settings } from './Settings';
import _ from 'lodash';
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

const requestRecordPermissions = async (objectApiName: string, recordId: string) => {
  if (!objectApiName || !recordId) {
    return;
  }
  return await client.sobject(objectApiName).getRecordPermissions(recordId);
}

const requestRecords = async (objectApiName: string, filters: any, fields: any, options?: any) => {
  const records = await client.sobject(objectApiName).find(filters, fields, options);
  /* TODO: lookup组件中初始化值需要 {o:'contract_types',ids:['fcxTeWMEvgdMQnvwZ'],label:"合同分类1"} 这种格式，
    故 将以下格式转换下。
    contracts_reference_to_func: {
      "reference_to._o": "contract_types",
      "reference_to.o": "contract_types",
      '_NAME_FIELD_VALUE': "合同分类1",
      '_id': "fcxTeWMEvgdMQnvwZ"
    }, 
  */
    // test_related_to
  _.forEach(records,(value,key)=>{
    // console.log('value=>',value)
    let tempValue=value;
    _.forEach(tempValue,(v,k)=>{
      if(k==="reference_to.o"){
        // console.log('have-"reference_to.o"')
      }
    })
  })
  console.log('requestRecords==>',requestRecords)
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

const deleteRecord = async (objectApiName: string, objectRecordId: string) => {
  const result = await client.sobject(objectApiName).delete(objectRecordId);

  return result;
}

export const API = {
  client,
  requestObject,
  requestRecordPermissions,
  requestRecords,
  updateRecord,
  insertRecord,
  deleteRecord
}