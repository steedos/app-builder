import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from "react-router-dom";
import { Iframe } from '@steedos/builder-object';
import { observer } from "mobx-react-lite";
import ProLayout, { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { Apps } from '@steedos/builder-store';
import _ from 'lodash';
import { Dropdown, Menu, Card, message, Space } from 'antd';
export const TabIframe = observer((props: any) => {
    const {appApiName, tabApiName, src, title} = props;
    // const currentApp = Apps.getCurrentApp(appApiName);
    // let title = '';
    // if(currentApp){
    //     const tab = _.find(currentApp.children, function(c){
    //         return c.id == tabApiName;
    //     })
    //     if(tab){
    //         title = tab.name;
    //     }
    // }
    return (
        <PageContainer title={false}
        header={{
            title: title,
            ghost: true
        }}
        >
           <Iframe src={src} style={{ height: "100%", width: "100%"}} />
        </PageContainer>
    );
});