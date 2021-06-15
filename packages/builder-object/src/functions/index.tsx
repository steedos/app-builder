import * as modal from './modal'
import { Tables } from '@steedos/builder-store';

export * from './modal'

const SteedosUI = Object.assign({}, modal, {
  getTableSelectedRows(id: string = "default"){
    return Tables.loadById(id).getSelectedRows();
  }
});

if(!window.SteedosUI){
  window.SteedosUI = SteedosUI;
}