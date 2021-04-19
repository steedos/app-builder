import React, { useRef } from 'react';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { SteedosProvider } from '@steedos/builder-steedos';
import { ObjectTable } from '@steedos/builder-object';
import { API } from '@steedos/builder-store';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Layout from './layouts';

const STEEDOS_ROOT_URL = "http://192.168.3.2:5080"
const STEEDOS_TENANT_ID = "cei48XfStzib6SHER"
const STEEDOS_USER_ID = "604189e68753dfc2885e6226"
const STEEDOS_AUTH_TOKEN = "12f86909afc6ff1c0aa1ec6f49b1d4275a5c08595df3c077d5d3afb39e7d55d8d862cf5846a6378e7c67d1"

const initialStore = {
  rootUrl: STEEDOS_ROOT_URL,
  tenantId: STEEDOS_TENANT_ID,
  userId: STEEDOS_USER_ID,
  authToken: STEEDOS_AUTH_TOKEN,
  currentObjectApiName: 'accounts',
  locale: 'zh_CN',
  forms: {},
  objects: {},
}

const routes = [
  {
    path: "/app/:appApiName",
    component: Layout
  }
];

function RouteWithSubRoutes(route: any) {
  return (
    <Route
      path={route.path}
      render={props => {
        // pass the sub-routes down to keep nesting
        const appApiName = props.match.params.appApiName
        return <route.component appApiName={appApiName} routes={route.routes} />
      }}
    />
  );
}

export default function App() {
  return (
    <SteedosProvider {...initialStore}>
      <Router>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </Router>
    </SteedosProvider>
  );
};