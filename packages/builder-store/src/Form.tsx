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
  value: types.frozen(),
  convertedFilters: types.frozen(),//根据value转换后的filters
}).actions(self => ({
  // note the `({`, we are returning an object literal
  setMode(newMode: string) {
    self.mode = newMode
  },
  setValue(value) {
    self.value = value;
  },
  setConvertedFilters(filters) {
    self.convertedFilters = filters;
  }
}))

export const Forms = types.model({
  items: types.optional(types.map(FormModel), {})
})
.actions((self) => {
  const loadById = (id: string)=>{
    if (!id)
      return null;
    const form = self.items.get(id) 
    if (form) {
      return form
    }
    const newForm = FormModel.create({
      id,
      mode: 'read'
    })
    self.items.put(newForm);
    return newForm
  }
  return {
    loadById,
  }
}).create()
