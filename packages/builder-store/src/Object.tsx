import { types } from "mobx-state-tree";

export const ObjectModel = types.model({
  id: types.identifier,
  datasource: types.string,
  json: types.string
})