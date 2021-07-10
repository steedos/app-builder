import * as modal from './modal'
import { Tables, Objects } from '@steedos/builder-store';

export * from './modal'

const SteedosUI = Object.assign({}, modal, {
  getTableSelectedRows(id: string = "default"){
    return Tables.loadById(id).getSelectedRows();
  },
  reloadRecord(objectApiName: string, id: string){
    Objects.getObject(objectApiName).reloadRecord(id)
  },
});

if(!window.SteedosUI){
  window.SteedosUI = SteedosUI;
}