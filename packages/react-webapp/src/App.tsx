import React, { useRef } from 'react';
import { SteedosProvider } from '@steedos/builder-steedos';
import { Settings } from '@steedos/builder-store'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Layout from './layouts';

const initialStore = {
  rootUrl: Settings.rootUrl,
  tenantId: Settings.tenantId,
  userId: Settings.userId,
  authToken: Settings.authToken,
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