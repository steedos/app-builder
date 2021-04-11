import { values } from "mobx"
import { types, getParent, flow } from "mobx-state-tree"
import { convertFieldsSchema } from './utils';
import { API } from './API';


export const RecordCache = types.model({
  id: types.identifier, //记录ID
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
      const json = yield API.requestRecords(self.objectApiName, filters, self.fields)
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
  schemaJson: types.string,
  recordCaches: types.map(RecordCache),
  recordListCaches: types.map(RecordListCache),
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
    console.log("===loadObject===", self.id);
    try {
      const json = yield API.requestObject(self.id)
      self.schemaJson = JSON.stringify(json)
      self.isLoading = false
      return self
    } catch (err) {
      console.error(`Failed to load object ${self.id} `, err)
    }
  })

  const getRecord = (recordId: string, fields: string[]) => {
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
    getRecordList
  }
})

export const Objects = types.model({
  objects: types.optional(types.map(ObjectModel), {})
})
.actions((self) => {
  const getObject = (objectApiName: string)=>{
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
    getObject,
  }
}).create()
