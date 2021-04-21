import React, { useRef } from 'react';
import { SteedosProvider } from '@steedos/builder-steedos';
import { Settings } from '@steedos/builder-store'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"

import Layout from './layouts';
import NoFoundPage from './pages/404';
// import UserLayout from './layouts/UserLayout';
import { SplitScreenLogin } from './pages/user/login/splitScreenLogin';

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
    component: SplitScreenLogin
  },
  {
    path: "/app/:appApiName",
    component: Layout
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
        return <route.component appApiName={appApiName} routes={route.routes} />
      }}
    />
  );
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
  );
};