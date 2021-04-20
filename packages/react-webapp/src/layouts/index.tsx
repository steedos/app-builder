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
import { ObjectListView } from '../pages/objectListView';
import { SteedosAppLauncher } from '@steedos/builder-lightning';


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
          const {appApiName, objectApiName, recordId} = props.match.params
          return <route.component appApiName={appApiName} objectApiName={objectApiName} recordId={recordId} routes={route.routes} />
        }}
      />
    );
  }

export default function Layout(props: any) {
    const { appApiName } = props;
    const [appName, setAppName] = useState('');
    const [appIcon, setAppIcon] = useState('https://www.steedos.com/img/logo.png');
    return (
          <ProLayout
            title={appName}
            logo = {appIcon}
            style={{
              // height: '100vh',
              // border: '1px solid #ddd',
            }}
            navTheme='dark'
            // headerRender= {(props: any) => {return (<SteedosAppLauncher/>)}}
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
                const appMenus: any = await API.client.doFetch(API.client.getUrl() + `/service/api/apps/${appApiName}/menus`, { method: 'get' });
                setAppName(appMenus.name);
                return appMenus.children
              },
            }}
            location={{
              pathname: '/welcome/welcome',
            }}
          >
            <Switch>
              {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
              ))}
            </Switch>
          </ProLayout>
    );
  };