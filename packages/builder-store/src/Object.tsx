import { values } from "mobx"
import { types, getParent, flow } from "mobx-state-tree"
import { SteedosClient } from '@steedos/client';
import { convertFieldsSchema } from './utils';

const {
  STEEDOS_ROOT_URL,
  STEEDOS_TENANT_ID,
  STEEDOS_USER_ID,
  STEEDOS_AUTH_TOKEN,
  STEEDOS_LOCALE = 'zh_CN'
} = process.env

const client = new SteedosClient();

client.setUrl(STEEDOS_ROOT_URL)
client.setUserId(STEEDOS_USER_ID)
client.setToken(STEEDOS_AUTH_TOKEN);
client.setSpaceId(STEEDOS_TENANT_ID);

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

export const RecordCache = types.model({
  id: types.identifier, 
  objectApiName: types.string,
  fields: types.array(types.string),
  recordJson: types.string,
  isLoading: true,
})
.views((self) => ({
  get data() {
    if (!self.recordJson)
      return null
    return JSON.parse(self.recordJson)
  },
}))
.actions((self) => {

  const loadRecord = flow(function* loadRecord() {
    try {
      const filters = ['_id', '=', self.id]
      const json = yield requestRecords(self.objectApiName, filters, self.fields)
      self.recordJson = JSON.stringify(json)
      self.isLoading = false
    } catch (err) {
      console.error(`Failed to load record ${self.id} `, err)
    }
  })

  return {
    loadRecord,
  }
});

export const ObjectModel = types.model({
  id: types.identifier, // object_api_name
  schemaJson: types.string,
  recordCaches: types.map(RecordCache),
  isLoading: true
})
.views((self) => ({
  get schema() {
    if (!self.schemaJson)
      return null
    return JSON.parse(self.schemaJson)
  },
}))
.actions((self) => {

  const loadObject = flow(function* loadObject() {
    try {
      const json = yield requestObject(self.id)
      self.schemaJson = JSON.stringify(json)
      self.isLoading = false
      return self
    } catch (err) {
      console.error(`Failed to load object ${self.id} `, err)
    }
  })

  const getRecord = (recordId, fields) => {
    const record = self.recordCaches.get(recordId)
    if (record)
      return record
    
    const newRecord = RecordCache.create({
      id: recordId,
      objectApiName: self.id,
      fields,
      recordJson: '',
      isLoading: true
    })
    self.recordCaches.put(newRecord);
    newRecord.loadRecord();
    return newRecord
  }

  const loadRecords = flow(function* loadRecords(filters, fields, options) {
    try {
      const json = yield requestRecords(self.id, filters, fields, options)
      return json
    } catch (err) {
      console.error(`Failed to load object ${self.id} `, err)
    }
  })

  return {
    loadObject,
    getRecord,
    loadRecords
  }
})

export const ObjectStore = types.model({
  objects: types.map(ObjectModel)
})
.actions((self) => {
  const getObject = (objectApiName)=>{
    const object = self.objects.get(objectApiName) 
    if (object) {
      return object
    }
    const newObject = ObjectModel.create({
      id: objectApiName,
      schemaJson: '',
      isLoading: true
    })
    self.objects.put(newObject);
    newObject.loadObject();
    return newObject
  }
  return {
    getObject
  }
})