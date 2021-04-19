import React, { useRef, useState } from 'react';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { ObjectTable, ObjectForm } from '@steedos/builder-object';
import { API } from '@steedos/builder-store';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


const routes = [
    {
        path: "/app/:appApiName/:objectApiName/view/:recordId",
        component: ObjectForm
    },
    {
        path: "/app/:appApiName/:objectApiName",
        component: ObjectTable
    },
];
  
  function RouteWithSubRoutes(route: any) {
    return (
      <Route
        path={route.path}
        render={props => {
          // pass the sub-routes down to keep nesting
          const objectApiName = props.match.params.objectApiName
          return <route.component {...props} objectApiName={objectApiName} columnFields={[{ fieldName: "name" }]} routes={route.routes} />
        }}
      />
    );
  }

export default function Layout(props: any) {
    const { appApiName } = props;
    const [appName, setAppName] = useState('');
    const [appIcon, setAppIcon] = useState(API.client.getUrl() + '/packages/steedos_creator/assets/logo-square.png');
    return (
          <ProLayout
            title={appName}
            // logo = {appIcon}
            style={{
              // height: '100vh',
              // border: '1px solid #ddd',
            }}
            navTheme='light'
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
            <PageContainer content={false} title={false} header={undefined}>
              <Switch>
                {routes.map((route, i) => (
                  <RouteWithSubRoutes key={i} {...route} />
                ))}
              </Switch>
            </PageContainer>
          </ProLayout>
    );
  };