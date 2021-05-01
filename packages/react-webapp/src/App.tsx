import React, { useRef } from 'react';
import { SteedosProvider } from '@steedos/builder-steedos';
import { Settings, User } from '@steedos/builder-store'
import { observer } from "mobx-react-lite";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory
} from "react-router-dom";
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { Layout } from './layouts';

import NoFoundPage from './pages/404';

import { Login } from './pages/user/login';

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
    path: "/login",
    component: Login
  },
  {
    path: "/app/:appApiName/:objectApiName",
    component: Layout
  },
  {
    path: "/app/:appApiName",
    component: Layout
  },
  {
    path: "/",
    component: Login
  },
  {
    path: "/404",
    component: NoFoundPage
  }
];

function RouteWithSubRoutes(route: any) {
  return (
    <Route
      path={route.path}
      render={props => {
        // pass the sub-routes down to keep nesting
        const appApiName = props.match.params.appApiName
        const objectApiName = props.match.params.objectApiName
        return <route.component appApiName={appApiName} objectApiName={objectApiName} routes={route.routes} />
      }}
    />
  );
}

export const Apps =  observer( () => {
  return (
    // <ChakraProvider theme={theme}>
      <SteedosProvider {...initialStore}>
        <Router>
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
            <Redirect from='*' to='/404' />
          </Switch>
        </Router>
      </SteedosProvider>
    // </ChakraProvider>
  );
});

export default Apps;

