import React, { useRef, useState } from 'react';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { API } from '@steedos/builder-store';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ObjectDetail } from '../pages/objectDetail';
// import { ObjectListView } from '../pages/objectListView';
import { ObjectListView } from '@steedos/builder-object';
import { SteedosAppLauncher } from "@steedos/builder-lightning";
import { observer } from "mobx-react-lite";
import { Apps } from '@steedos/builder-store';
import _ from 'lodash';
import { useHistory } from "react-router-dom";
import { RightContent } from '../components/GlobalHeader/RightContent';
import { SteedosIcon } from '@steedos/builder-lightning';
import { TabIframe } from '../pages/tabIframe';
import { Image } from 'antd';

const routes = [

  {
    path: "/app/:appApiName/:objectApiName/view/:recordId",
    component: ObjectDetail
  },
  {
    path: "/app/:appApiName/frame/:tabApiName",
    component: TabIframe
  },
  {
    path: "/app/:appApiName/:objectApiName/grid/:listViewApiName",
    component: ObjectListView
  },
  {
    path: "/app/:appApiName/:objectApiName",
    component: ObjectListView
  }
];

function RouteWithSubRoutes(route: any, history: any) {
  return (
    <Route
      path={route.path}
      render={props => {
        console.log(`RouteWithSubRoutes props`, props)
        // pass the sub-routes down to keep nesting
        const { appApiName, objectApiName, recordId, tabApiName, listViewApiName } = props.match.params
        let src = null;
        let title = null;
        if(props.location && props.location.state){
          const state: any = props.location.state;
          if(state.src){
            src = state.src
          }
          if(state.title){
            title = state.title
          }
        }
        return <route.component listViewApiName={listViewApiName} tabApiName={tabApiName} src={src} title={title} history={props.history} appApiName={appApiName} objectApiName={objectApiName} recordId={recordId} routes={route.routes} />
      }}
    />
  );
}

export const Layout = observer((props: any) => {
  let history = useHistory();
  let { appApiName, objectApiName } = props;
  const actionRef = useRef<{
    reload: () => void;
  }>();
  const appsMenus = Apps.getMenus();
  if (appsMenus && appsMenus.size && Apps.currentAppId != appApiName) {
    setTimeout(actionRef.current?.reload, 100)
  }
  const currentApp = Apps.getCurrentApp(appApiName);
  // let menu = null;
  let apps = [];
  if (appsMenus) {
    appsMenus.forEach(function (app) {
      apps.push(app)
    })
  }

  if(currentApp && !objectApiName){
    if(currentApp.children && currentApp.children.length > 0){
      history.push(currentApp.children[0].path)
    }
  }

  
  const loopMenuItem = (menus: any[]): any[] =>{
    return menus.map(({ icon, children, ...item }) => ({
      ...item,
      icon: icon && <span role="img" aria-label="smile" className="anticon anticon-smile"><SteedosIcon name={icon} size="x-small"/></span>,
      children: children && loopMenuItem(children),
    }));
  }

  return (
    <ProLayout
      actionRef={actionRef}
      navTheme='dark'
      location={history.location}
      // logo="http://localhost:5000/packages/steedos_creator/assets/logo-square.png"
      menuHeaderRender={(logo, title, menuProps) => { 
        const {collapsed, logo: logoUrl, title: titleValue} = menuProps;
        return (
          <div>
            {collapsed ? null : (logoUrl ? (<img src={logoUrl.toString()} alt={titleValue.toString()} />) : logoUrl)}
            <SteedosAppLauncher currentApp={currentApp} apps={apps} history={history}/>
          </div>
      ) }}
      fixSiderbar={true}
      menuItemRender={(item, dom) => {
        if ((item.path?.startsWith('http://') || item.path?.startsWith('https://')) && item.target =='_blank') {
          return <a target='_blank' href={item.path}>
              <span className="ant-pro-menu-item">
                {item.icon}
              <span className="ant-pro-menu-item-title">{item.name}</span>
            </span>
            </a>
        } else {

          if(item.type ==='url'){
            return <Link to={{pathname: `/app/${appApiName}/frame/${item.id}`, state: { src: item.path, title: item.name }}}>
            <span className="ant-pro-menu-item">
                {item.icon}
              <span className="ant-pro-menu-item-title">{item.name}</span>
            </span>
          </Link>
          }else{
            return <Link to={item.path}>
            <span className="ant-pro-menu-item">
                {item.icon}
              <span className="ant-pro-menu-item-title">{item.name}</span>
            </span>
          </Link>
          }
        }

      }}
      menu={{
        request: async () => {
          const appMenus: any = await API.client.doFetch(API.client.getUrl() + `/service/api/apps/${Apps.currentAppId || '-'}/menus`, { method: 'get' });
          return loopMenuItem(appMenus.children)
        },
      }}
      rightContentRender={() => <RightContent />}
    >
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        ))}
      </Switch>
    </ProLayout>
  );
});