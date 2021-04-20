import React, { useRef, useState } from 'react';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { ObjectForm } from '@steedos/builder-object';
import { Button, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Objects } from '@steedos/builder-store';
import * as _ from 'lodash';
import { observer } from "mobx-react-lite"

export const ObjectDetail = observer((props: any) => {
  const { appApiName, objectApiName, recordId } = props;
  const object:any = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div>Loading object ...</div>)
  const recordCache = object.getRecord(recordId, [])
  if (recordCache.isLoading) return (<div>Loading record ...</div>)
  const schema = object.schema ;
  let title = '';
  if(recordCache.data && recordCache.data.value && recordCache.data.value.length > 0){
    const record = recordCache.data.value[0];
    title = record[schema.NAME_FIELD_KEY]
  }
  const extraButtons:any[] = [];
  const dropdownMenus: any[] = [];
  if(schema.actions){
    _.each(schema.actions, function(action: any, actionApiName: string){
      if(_.includes(['record', 'record_only'], action.on)){
        extraButtons.push(<Button key={actionApiName} onClick={action.todo} type={actionApiName === 'standard_edit' ? "primary":"default"}>{action.label}</Button>)
      }
      if(action.on === 'record_more'){
        dropdownMenus.push(<Menu.Item key={actionApiName} onClick={action.todo}>{action.label}</Menu.Item>)
      }
    })
  }
  return (
    <PageContainer content={false} title={false} header={{
      title: title,
      ghost: true,
      breadcrumb: {
        routes: [
          {
            path: `/app/${appApiName}`,
            breadcrumbName: '列表',
          },
          {
            path: '',
            breadcrumbName: '详细',
          },
        ],
      },
      extra: [
        ...extraButtons,
        <Dropdown
            key="dropdown"
            trigger={['click']}
            overlay={
              <Menu>
                {dropdownMenus}
              </Menu>
            }
          >
            <Button key="4" style={{ padding: '0 8px' }}>
              <EllipsisOutlined />
            </Button>
          </Dropdown>
      ],
    }}
>
      <ObjectForm objectApiName={objectApiName} mode='read'/>
  </PageContainer>
  );
});