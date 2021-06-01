import * as modal from './modal'

export * from './modal'

const SteedosUI = Object.assign({}, modal);

if(!window.SteedosUI){
  window.SteedosUI = SteedosUI;
}