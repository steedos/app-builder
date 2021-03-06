import * as React from "react"
import ReactDOM from "react-dom";
import { ObjectForm, SteedosProvider, ObjectModal, SpaceUsers, SpaceUsersModal, Organizations, OrganizationsModal, ObjectTable} from "../";
import {
  BrowserRouter as Router
} from "react-router-dom";
import "./modal.less"
import { defaultsDeep, has } from 'lodash'

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

export const showModal = (component: React.FunctionComponent, componentParams: any, modalParams: any, provideProps: any = {} ) => {

  if(window.Creator && !provideProps.iconPath){
    provideProps.iconPath = '/assets/icons'
  }

  if(!component){
    component = ObjectForm
  }
  let ModalComponent:any = ObjectForm;
  if(!componentParams){
    componentParams = {};
  }
  if(!componentParams.name){
    componentParams.name = "modal-default";
  }
  if(component !== ObjectForm){
    ModalComponent = ObjectModal;
    componentParams.contentComponent = component;
    if([SpaceUsers].indexOf(component as any) > -1){
      ModalComponent = SpaceUsersModal;
    }
    else if([Organizations].indexOf(component  as any) > -1){
      ModalComponent = OrganizationsModal;
    }
  }
  
  let modalRoot = document.getElementById(`steedos-modal-root-${componentParams.name}`);
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', `steedos-modal-root-${componentParams.name}`);
    document.body.appendChild(modalRoot)
  }
  let trigger = React.createElement("button", {className: `hidden steedos-modal-trigger-${componentParams.name}`});
  const wrapComponent: any = withModalWrap(ModalComponent, provideProps);

  const defModalProps = {
    width: "70%",
    style: {
      width: "70%",
      maxWidth: "950px",
      minWidth: "480px",
    }
  }

  if(component == ObjectForm && ! has(componentParams, 'width')){
    componentParams.width = '70%';
  }

  componentParams.modalProps = defaultsDeep({}, defModalProps, componentParams.modalProps || {})

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