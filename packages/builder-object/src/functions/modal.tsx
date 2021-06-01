import * as React from "react"
import ReactDOM from "react-dom";
import { ObjectForm } from "../";

export function showModal(component: React.FunctionComponent, componentParams: any, modalParams: any) {
  if(!component){
    component = ObjectForm
  }
  if(!componentParams || !componentParams.name){
    console.error("Miss name props for the component params.");
    return;
  }
  let triggerDom = document.querySelector(`#steedos-modal-root .steedos-modal-trigger-${componentParams.name}`);
  if(!triggerDom){
    const Component: any = component;
    let modalRoot = document.getElementById('steedos-modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.setAttribute('id', 'steedos-modal-root');
      document.body.appendChild(modalRoot)
    }
    let trigger = React.createElement("button", {className: `hidden, steedos-modal-trigger-${componentParams.name}`});
    ReactDOM.render(React.createElement(Component,{
      ...componentParams,
      trigger
    }), modalRoot)
    triggerDom = document.querySelector(`#steedos-modal-root .steedos-modal-trigger-${componentParams.name}`);
  }
  triggerDom && (triggerDom as any).click()
}