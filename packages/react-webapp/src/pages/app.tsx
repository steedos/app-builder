import React, { useRef, useState } from 'react';

import { Apps } from "@steedos/builder-store";
import { Route, Switch, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { ObjectDetail } from '../pages/objectDetail';
import { ListView } from '../pages/listView';
import { TabIframe } from '../pages/tabIframe';
import { observer } from "mobx-react-lite";
import { Layout } from '../layouts';

export const App = observer((props: any) => {
  const history = useHistory();

  const params: any = useParams();
  let { appApiName, objectApiName } = params;

  const menus = Apps.getMenus()
  if (!menus || !menus.size)
    return null

  if (!appApiName)
    return null

  Apps.setCurrentAppId(appApiName);

  const currentApp = Apps.getCurrentApp()
  if (!currentApp)
    return null;

  // if (!objectApiName) {
  //   const firstTab = currentApp.children[0];
  //   history.push(firstTab.path);
  //   return null;
  // }

  return (
    <Layout>
      <Switch>
        <Route path="/app/:appApiName/:objectApiName" component={ListView} exact/>
        <Route path="/app/:appApiName/:objectApiName/grid/:listName" component={ListView} exact/> 
        <Route path="/app/:appApiName/:objectApiName/view/:recordId" component={ObjectDetail} exact/>
        <Route path="/app/:appApiName/frame/:tabApiName" component={TabIframe} exact/>
      </Switch>
    </Layout>
  )
});