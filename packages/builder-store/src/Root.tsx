import { types, Instance, onSnapshot } from "mobx-state-tree";
import { FormModel } from "./Form";
import { TableModel } from "./Table";
import { ObjectModel, ObjectStore } from "./Object";

// Define a store just like a model
export const RootModel = types.model({
  currentObjectApiName: types.union(types.string, types.undefined, types.null), 
  currentRecordId: types.union(types.string, types.undefined, types.null), 
  forms: types.optional(types.map(FormModel), {}),
  tables: types.optional(types.map(TableModel), {}),
  objects: types.optional(types.map(ObjectModel), {}),
  objectStore: types.optional(ObjectStore, {
      objects: {}
  }),
}).actions(self => ({
  setCurrentObjectApiName(name: string) {
    self.currentObjectApiName = name;
  },
  setCurrentRecordId(id: string) {
    self.currentRecordId = id;
  },
  getCurrentObjectApiName(name: string) {
    return self.currentObjectApiName;
  },
  getCurrentRecordId(id: string) {
    return self.currentRecordId = id;
  },
  setInitialState(state: any){
    // self.currentObjectApiName = state;
    Object.assign(self, state);
  }
}))

let initialState = RootModel.create({
  currentObjectApiName: null, 
  currentRecordId: null, 
  forms: {},
  tables: {},
  objects: {}
});

// const data = localStorage.getItem('rootState');
// if (data) {
//   const json: any = JSON.parse(data);
//   if (RootModel.is(json)) {
//     initialState = RootModel.create(json as any);
//   }
// }

export const rootStore = initialState;

// onSnapshot(store, snapshot => {
//   console.log("Snapshot: ", snapshot);
//   localStorage.setItem('rootState', JSON.stringify(snapshot));
// });

export type RootInstance = Instance<typeof RootModel>;