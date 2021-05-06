import React, { useRef } from 'react';
import { SteedosProvider } from '@steedos/builder-steedos';
import { Settings, User } from '@steedos/builder-store';
import { observer } from "mobx-react-lite";
import SLDSSettings from '@salesforce/design-system-react/components/SLDSSettings';

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
import { App } from './pages/app';

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


export const Apps =  () => {
  
  SLDSSettings.setAppElement('#root');
  return (
    // <ChakraProvider theme={theme}>
      <SteedosProvider {...initialStore}>
        <Router>
          <Switch>
            <Route path="/login" component={Login} exact/>
            <Route path="/app/:appApiName/" component={App}/>
            <Route path="/" component={Layout}/>
            <Redirect from='*' to='/404' />
          </Switch>
        </Router>
      </SteedosProvider>
    // </ChakraProvider>
  );
};

export default Apps;

