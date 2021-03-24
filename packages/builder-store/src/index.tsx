import { useContext, createContext } from "react";
import { types, Instance, onSnapshot } from "mobx-state-tree";

export const FormFieldModel = types.model({
  id: types.identifier,
  name: types.string,
  required: types.boolean,
  readonly: types.boolean,
})

export const FormModel = types.model({
  id: types.identifier,
  // objectApiName: types.string,
  // fields: types.array(FormFieldModel),
  mode: types.union(types.string, types.undefined), // 'read' | 'edit'
}).actions(self => ({
  // note the `({`, we are returning an object literal
  setMode(newMode: string) {
    self.mode = newMode
  }
}))

export const TableModel = types.model({
  id: types.identifier
}).actions(self => ({
}))

export const ObjectModel = types.model({
  id: types.identifier,
  datasource: types.string,
  json: types.string
})

// Define a store just like a model
export const RootModel = types.model({
  currentObjectApiName: types.union(types.string, types.undefined, types.null), 
  currentRecordId: types.union(types.string, types.undefined, types.null), 
  forms: types.optional(types.map(FormModel), {}),
  tables: types.optional(types.map(TableModel), {}),
  objects: types.optional(types.map(ObjectModel), {}),
}).actions(self => ({
  setCurrentObjectApiName(name: string) {
    self.currentObjectApiName = name;
  },
  setCurrentRecordId(id: string) {
    self.currentRecordId = id;
  }
}))

// export const store = RootModel.create({
// })


let initialState = RootModel.create({
});

export const store = initialState;

// const data = localStorage.getItem('rootState');
// if (data) {
//   const json: any = JSON.parse(data);
//   if (RootModel.is(json)) {
//     initialState = RootModel.create(json as any);
//   }
// }

// onSnapshot(store, snapshot => {
//   console.log("Snapshot: ", snapshot);
//   localStorage.setItem('rootState', JSON.stringify(snapshot));
// });

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;
export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
