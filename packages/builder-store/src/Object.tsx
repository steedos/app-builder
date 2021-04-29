import { values } from "mobx"
import { types, getParent, flow } from "mobx-state-tree"
import { API } from './API';
import { getObjectOdataExpandFields ,convertRecordsForLookup} from './utils/index'

export const RecordCache = types.model({
  id: types.identifier, //记录ID
  objectApiName: types.string,
  fields: types.array(types.string),
  data: types.frozen(),
  permissions: types.frozen(),
  isLoading: true,
})
.actions((self) => {

  const loadRecord = flow(function* loadRecord() {
    try {
      const filters = ['_id', '=', self.id]
      const object = Objects.getObject(self.objectApiName).schema;
      const expand = getObjectOdataExpandFields(object, self.fields)
      // 添加 expand 参数
      const dataResult = yield API.requestRecords(self.objectApiName, filters, self.fields, {expand})
      // lookup组件reference_to是否是数组 的初始化值 的转换。
      self.data = convertRecordsForLookup(dataResult, object.fields)

      self.permissions = yield API.requestRecordPermissions(self.objectApiName, self.id);
      self.isLoading = false
    } catch (err) {
      console.error(`Failed to load record ${self.id} `, err)
    }
  });

  const deleteRecord = flow(function* deleteRecord() {
    try {
      return yield API.deleteRecord(self.objectApiName, self.id);
      self.isLoading = false
    } catch (err) {
      console.error(`Failed to delete record ${self.id} `, err)
    }
  });

  return {
    loadRecord,
    deleteRecord
  }
});

export const RecordListCache = types.model({
  id: types.identifier, //请求的filters, fields
  objectApiName: types.string,
  filters: types.string,
  fields: types.array(types.string),
  options: types.union(types.string, types.undefined),
  recordsJson: types.string,
  isLoading: true,
})
.views((self) => ({
  get data() {
    if (!self.recordsJson)
      return null
    return JSON.parse(self.recordsJson)
  },
}))
.actions((self) => {
  const loadRecords = flow(function* loadRecords() {
    try {
      const filters = JSON.parse(self.filters);
      const options = self.options ? JSON.parse(self.options) : undefined;
      const json = yield API.requestRecords(self.objectApiName, filters, self.fields, options)
      self.recordsJson = JSON.stringify(json)
      self.isLoading = false
    } catch (err) {
      console.error(`Failed to load record ${self.id} `, err)
    }
  })

  return {
    loadRecords,
  }
});

export const ObjectModel = types.model({
  id: types.identifier, // object_api_name
  schema: types.frozen(),
  recordCaches: types.map(RecordCache),
  recordListCaches: types.map(RecordListCache),
  isLoading: true
})
.actions((self) => {

  const loadObject = flow(function* loadObject() {
    try {
      self.schema = yield API.requestObject(self.id)
      self.isLoading = false
      const Creator = window.Creator;
      Creator.Objects[self.id] = self.schema
      return self
    } catch (err) {
      console.error(`Failed to load object ${self.id} `, err)
    }
  })

  const getRecord = (recordId: string, fields: string[]) => {
    if (!recordId)
      return null;
    const record = self.recordCaches.get(recordId)
    if (record)
      return record
    const newRecord = RecordCache.create({
      id: recordId,
      objectApiName: self.id,
      fields,
      data: {},
      isLoading: true
    })
    self.recordCaches.put(newRecord);
    newRecord.loadRecord();
    return newRecord
  }

  const deleteRecord = (recordId: string)=>{
    if (!recordId){
      return null;
    }
    const record = self.recordCaches.get(recordId)
    if (record){
      record.deleteRecord();
      self.recordCaches.delete(recordId)
    }
  }

  const getRecordList = (filters: any, fields: any, options?) => {
    const stringifyFilters = JSON.stringify(filters);
    const stringifyFields = JSON.stringify(fields);
    const stringifyOptions = options ? JSON.stringify(options) : "";
    const recordListId = stringifyFilters;
    const recordList = self.recordListCaches.get(recordListId)
    if (recordList)
      return recordList
    
    const newRecordList = RecordListCache.create({
      id: recordListId,
      objectApiName: self.id,
      filters: stringifyFilters,
      fields,
      options: stringifyOptions,
      recordsJson: '',
      isLoading: true
    })
    self.recordListCaches.put(newRecordList);
    newRecordList.loadRecords();
    return newRecordList
  }

  return {
    loadObject,
    getRecord,
    deleteRecord,
    getRecordList
  }
})

export const Objects = types.model({
  objects: types.optional(types.map(ObjectModel), {})
})
.actions((self) => {
  const getObject = (objectApiName: string)=>{
    if (!objectApiName)
      return null;
    const object = self.objects.get(objectApiName) 
    if (object) {
      return object
    }
    const newObject = ObjectModel.create({
      id: objectApiName,
      schema: {},
      isLoading: true
    })
    self.objects.put(newObject);
    newObject.loadObject();
    return newObject
  }
  return {
    getObject,
  }
}).create()
