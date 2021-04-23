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

const routes = [
  {
    path: "/app/:appApiName/:objectApiName/view/:recordId",
    component: ObjectDetail
  },
  {
    path: "/app/:appApiName/:objectApiName",
    component: ObjectListView
  },
];

function RouteWithSubRoutes(route: any) {
  return (
    <Route
      path={route.path}
      render={props => {
        // pass the sub-routes down to keep nesting
        const { appApiName, objectApiName, recordId } = props.match.params
        return <route.component appApiName={appApiName} objectApiName={objectApiName} recordId={recordId} routes={route.routes} />
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


  return (
    <ProLayout
      actionRef={actionRef}
      navTheme='dark'
      menuHeaderRender={(props: any) => { return (<SteedosAppLauncher currentApp={currentApp} apps={apps} history={history}/>) }}
      fixSiderbar={true}
      menuItemRender={(item, dom) => {
        if (item.path?.startsWith('http://') || item.path?.startsWith('https://')) {
          return <a target='_blank' href={item.path}>{item.name}</a>
        } else {
          return <Link to={item.path || '/welcome'}>
            {item.name}
          </Link>
        }

      }}
      menu={{
        request: async () => {
          const appMenus: any = await API.client.doFetch(API.client.getUrl() + `/service/api/apps/${Apps.currentAppId || '-'}/menus`, { method: 'get' });
          return appMenus.children
        },
      }}
      location={{
        pathname: '/welcome/welcome',
      }}
      rightContentRender={() => <RightContent />}
    >
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </ProLayout>
  );
});