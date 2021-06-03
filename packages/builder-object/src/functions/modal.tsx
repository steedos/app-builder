import * as React from "react"
import ReactDOM from "react-dom";
import { ObjectForm, SteedosProvider } from "../";
import {
  BrowserRouter as Router
} from "react-router-dom";

const withModalWrap = (component: React.FunctionComponent, provideProps) => {
  return (props: any) => {
    const ModalComponent = component;
    return (<SteedosProvider {...provideProps}>
      <Router>
        <ModalComponent {...props}/>
      </Router>
    </SteedosProvider>);
  }
}

export const showModal = (component: React.FunctionComponent, componentParams: any, modalParams: any, provideProps: any) => {
  if(!component){
    component = ObjectForm
  }
  if(!componentParams){
    componentParams = {};
  }
  if(!componentParams.name){
    componentParams.name = "modal-default";
  }
  let modalRoot = document.getElementById(`steedos-modal-root-${componentParams.name}`);
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', `steedos-modal-root-${componentParams.name}`);
    document.body.appendChild(modalRoot)
  }
  let trigger = React.createElement("button", {className: `hidden steedos-modal-trigger-${componentParams.name}`});
  const wrapComponent: any = withModalWrap(component, provideProps);
  const contentEle = React.createElement(wrapComponent,{
    ...componentParams,
    trigger
  });
  ReactDOM.render(contentEle, modalRoot);
  setTimeout(()=>{
    let triggerDom = document.querySelector(`#steedos-modal-root-${componentParams.name} .steedos-modal-trigger-${componentParams.name}`);
    triggerDom && (triggerDom as any).click();
  }, 500);
}