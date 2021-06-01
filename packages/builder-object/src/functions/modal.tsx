import * as React from "react"
import ReactDOM from "react-dom";
import { ObjectForm, SteedosProvider } from "../";
import {
  BrowserRouter as Router
} from "react-router-dom";

const withModalWrap = (component: React.FunctionComponent) => {
  return (props: any) => {
    const ModalComponent = component;
    return (<SteedosProvider>
      <Router>
        <ModalComponent {...props}/>
      </Router>
    </SteedosProvider>);
  }
}

export const showModal = (component: React.FunctionComponent, componentParams: any, modalParams: any) => {
  if(!component){
    component = ObjectForm
  }
  if(!componentParams || !componentParams.name){
    console.error("Miss name props for the component params.");
    return;
  }
  let triggerDom = document.querySelector(`#steedos-modal-root .steedos-modal-trigger-${componentParams.name}`);
  if(triggerDom){
    (triggerDom as any).click()
  }
  else{
    let modalRoot = document.getElementById('steedos-modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.setAttribute('id', 'steedos-modal-root');
      document.body.appendChild(modalRoot)
    }
    let trigger = React.createElement("button", {className: `hidden steedos-modal-trigger-${componentParams.name}`});
    const wrapComponent: any = withModalWrap(component);
    const contentEle = React.createElement(wrapComponent,{
      ...componentParams,
      trigger
    });
    // ReactDOM.render(React.createElement(SteedosProvider, null, contentEle), modalRoot)
    ReactDOM.render(contentEle, modalRoot);
    setTimeout(()=>{
      triggerDom = document.querySelector(`#steedos-modal-root .steedos-modal-trigger-${componentParams.name}`);
      triggerDom && (triggerDom as any).click();
    }, 500);
  }
}