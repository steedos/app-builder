import { types, flow } from "mobx-state-tree";
import { pullAllBy, differenceBy, remove } from "lodash";
import { API } from './API';

export const TableModel = types.model({
  id: types.identifier,
  objectApiName: types.string,
  // selectedRows: types.union(types.array(TableRowModel), types.undefined),
  // selectedRows: types.union(types.array(types.frozen()), types.undefined)
  rowKey: types.union(types.string, types.undefined),
  selectedRows: types.frozen(),
  isLoading: false
}).actions(self => {
  const getRowKey = () => {
    return self.rowKey || "_id";
  };
  const setSelectedRows = (rows: any) => {
    self.selectedRows = rows
  };
  const getSelectedRows = () => {
    return self.selectedRows || [];
  };
  const addSelectedRows = (rows: any) => {
    if(rows && rows.length){
      const rowKey = getRowKey();
      const selectedRows = getSelectedRows();
      const rowsForAdd = differenceBy(rows, selectedRows, rowKey);
      self.selectedRows = selectedRows.concat(rowsForAdd);
    }
  };
  const addSelectedRow = (row: any) => {
    if(row){
      addSelectedRows([row]);
    }
  };
  const loadSelectedRows = flow(function* loadSelectedRows(keys: any, columns: any = ["name"]) {
    try {
      if(!self.objectApiName){
        console.error(`loadSelectedRows failed, miss objectApiName for this table ${self.id}, you can set it by the function 'setObjectApiName' or give it's value while load the table by the function 'loadById'.`);
      }
      self.isLoading = true;
      const filters = [getRowKey(), "=", keys]
      const result = yield API.requestRecords(self.objectApiName, filters, columns);
      const rows = result && result.value;
      addSelectedRows(rows);
      self.isLoading = false;
    } catch (err) {
      console.error(`Failed to load record ${self.id} `, err)
    }
  });
  const addSelectedRowsByKeys = (keys: any, columns: any) => {
    if(keys && keys.length){
      loadSelectedRows(keys, columns);
    }
  };
  const addSelectedRowByKey = (key: any, columns: any) => {
    if(key){
      addSelectedRowsByKeys([key], columns);
    }
  };
  const removeSelectedRows = (rows: any) => {
    const rowKey = getRowKey();
    const selectedRows = getSelectedRows();
    pullAllBy(selectedRows, rows, rowKey)
  };
  const removeSelectedRow = (row: any) => {
    removeSelectedRows([row]);
  };
  const removeSelectedRowsByKeys = (keys: any) => {
    const rowKey = getRowKey();
    const selectedRows = getSelectedRows();
    self.selectedRows = remove(selectedRows, (n) => {
      return keys.indexOf(n[rowKey]) > -1;
    });
  };
  const removeSelectedRowByKey = (key: any) => {
    removeSelectedRowsByKeys([key]);
  };
  const setObjectApiName = (id: string) => {
    self.objectApiName = id;
  };
  return {
    getRowKey,
    setSelectedRows,
    getSelectedRows,
    addSelectedRows,
    addSelectedRow,
    addSelectedRowsByKeys,
    addSelectedRowByKey,
    removeSelectedRows,
    removeSelectedRow,
    removeSelectedRowsByKeys,
    removeSelectedRowByKey,
    setObjectApiName
  }
})

export const Tables = types.model({
  items: types.optional(types.map(TableModel), {})
})
.actions((self) => {
  const loadById = (id: string, objectApiName?: string, rowKey: string = "_id")=>{
    if (!id)
      return null;
    const table = self.items.get(id) 
    if (table) {
      return table
    }
    const newTable = TableModel.create({
      id, 
      objectApiName, 
      rowKey
    })
    self.items.put(newTable);
    return newTable
  }
  return {
    loadById,
  }
}).create()
