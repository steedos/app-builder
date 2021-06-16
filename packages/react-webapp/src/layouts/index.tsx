import React, { useRef, useState } from 'react';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { API } from '@steedos/builder-store';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
// import { ObjectListView } from '@steedos/builder-object';
import { SteedosAppLauncher } from "@steedos/builder-lightning";
import { observer } from "mobx-react-lite";
import { Apps } from '@steedos/builder-store';
import _ from 'lodash';
import { useHistory } from "react-router-dom";
import ProSkeleton from '@ant-design/pro-skeleton';
import { RightContent } from '../components/GlobalHeader/RightContent';
import { SteedosIcon } from '@steedos/builder-lightning';
import { Image, Spin } from 'antd';
import { Objects} from '@steedos/builder-store';
import { Settings, User } from '@steedos/builder-store';

export const Layout = observer((props: any) => {
  let history = useHistory();

  const params : any = useParams();
  let { appApiName, objectApiName } = params;

  User.getMe();
  if (User.isLoading)
    return (<div style={{display:'flex',width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}><Spin/></div>)
  User.getSession();
  if (User.isLoading)
    return (<div style={{display:'flex',width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}><Spin/></div>)
  if (!User.me) {
    history.push('/login');
    return (<>Please login</>);
  }


  Apps.setCurrentAppId(appApiName)
  const currentApp = Apps.getCurrentApp();
  const appsMenus = Apps.getMenus()
  let apps = [];
  if (appsMenus) {
    appsMenus.forEach(function (app) {
      apps.push(app)
    })
  }
  if (!currentApp)
    return null;

  // if(currentApp && !objectApiName){
  //   if(currentApp.children && currentApp.children.length > 0){
  //     const firstTab = currentApp.children[0];
  //     if(firstTab.type ==='url'){
	// 			// history.push(`/app/${currentApp.id}/frame/${firstTab.id}`, {src: firstTab.path, title: firstTab.name});
	// 		}else{
  //       // history.push(firstTab.path);
  //       return null;
	// 		}
  //   }
  // }
  
  const loopMenuItem = (menus: any[]): any[] =>{
    return menus.map(({ icon, children, id, ...item }) => ({
      ...item,
      key: id,
      id,
      icon: icon && <span role="img" aria-label="smile" className="anticon anticon-smile"><SteedosIcon name={icon} size="x-small"/></span>,
      children: children && loopMenuItem(children),
    }));
  }

  const spaceId = Settings.tenantId
  const spaceObject = Objects.getObject("spaces");
  const spaceRecord = spaceObject.getRecord(spaceId, ["avatar", "name"]);
  if (spaceObject.isLoading || spaceRecord.isLoading)
    return (<ProSkeleton type="list" />)
  const spaceData = spaceRecord && spaceRecord.data && spaceRecord.data.value && spaceRecord.data.value[0];
  const {name: spaceTitle , avatar: logoAvatar} = spaceData || {};


  let logoAvatarUrl = "";
  if(logoAvatar){
    logoAvatarUrl = Settings.rootUrl + '/api/files/avatars/' + logoAvatar;
  }
  return (
    <ProLayout
      title="Steedos"
      navTheme='dark'
      location={history.location}
      logo={logoAvatarUrl}
      menuHeaderRender={(logo, title, menuProps) => { 
        const {collapsed, logo: logoUrl, title: titleValue} = menuProps || {};
        const logoDom = logoUrl ? (<img src={logoUrl.toString()} alt={titleValue.toString()} />) :null;
        return (
          logoDom
      ) }}
      menuExtraRender={() => (<SteedosAppLauncher currentApp={currentApp} apps={apps} history={history}/>)}
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
      menuDataRender={() => loopMenuItem(currentApp.children)}
      rightContentRender={() => <RightContent />}
    >
      {props.children}
    </ProLayout>
  );
});