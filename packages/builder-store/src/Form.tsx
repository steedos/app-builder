import { types } from "mobx-state-tree";

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