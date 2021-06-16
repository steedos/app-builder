import { types } from "mobx-state-tree";
import { pullAllBy, differenceBy, remove } from "lodash";

export const TableModel = types.model({
  id: types.identifier,
  // selectedRows: types.union(types.array(TableRowModel), types.undefined),
  // selectedRows: types.union(types.array(types.frozen()), types.undefined)
  rowKey: types.union(types.string, types.undefined),
  selectedRows: types.frozen()
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
    const rowKey = getRowKey();
    const rowsForAdd = differenceBy(rows, self.selectedRows, rowKey);
    self.selectedRows = self.selectedRows.concat(rowsForAdd);
  };
  const addSelectedRow = (row: any) => {
    addSelectedRows([row]);
  };
  const addSelectedRowsByKeys = (keys: any, columns: any = ["name"]) => {
    
  };
  const addSelectedRowByKey = (key: any, columns: any) => {
    addSelectedRowsByKeys([key], columns);
  };
  const removeSelectedRows = (rows: any) => {
    const rowKey = getRowKey();
    pullAllBy(self.selectedRows, rows, rowKey)
  };
  const removeSelectedRow = (row: any) => {
    removeSelectedRows([row]);
  };
  const removeSelectedRowsByKeys = (keys: any) => {
    const rowKey = getRowKey();
    self.selectedRows = remove(self.selectedRows, function(n) {
      return keys.indexOf(n[rowKey]) > -1;
    });
  };
  const removeSelectedRowByKey = (key: any) => {
    removeSelectedRowsByKeys([key]);
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
    removeSelectedRowByKey
  }
})

export const Tables = types.model({
  items: types.optional(types.map(TableModel), {})
})
.actions((self) => {
  const loadById = (id: string)=>{
    if (!id)
      return null;
    const table = self.items.get(id) 
    if (table) {
      return table
    }
    const newTable = TableModel.create({
      id
    })
    self.items.put(newTable);
    return newTable
  }
  return {
    loadById,
  }
}).create()
