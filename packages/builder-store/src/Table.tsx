import { types } from "mobx-state-tree";

export const TableRowModel = types.model({
  id: types.identifier,
  name: types.string,
  required: types.boolean,
  readonly: types.boolean,
})

export const TableModel = types.model({
  id: types.identifier,
  // selectedRows: types.union(types.array(TableRowModel), types.undefined),
  // selectedRows: types.union(types.array(types.frozen()), types.undefined)
  selectedRows: types.frozen()
}).actions(self => ({
  setSelectedRows(rows: any) {
    self.selectedRows = rows
  },
  getSelectedRows() {
    return self.selectedRows || [];
  }
}))

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
