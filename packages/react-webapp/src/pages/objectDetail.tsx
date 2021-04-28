import React, { useRef, useState } from 'react';
import ProLayout, { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { ObjectForm } from '@steedos/builder-object';
import { Button, Dropdown, Menu, Card, message, Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Forms, Objects } from '@steedos/builder-store';
import * as _ from 'lodash';
import { observer } from "mobx-react-lite";
import { Link, useHistory } from "react-router-dom";
import ProSkeleton from '@ant-design/pro-skeleton';

import { RelatedList } from './relatedList';

function getRelatedList(objectSchema){
  const detailsInfo = objectSchema.details;
  const relatedList = [];
  _.each(detailsInfo, function(detailInfo){
    const index = detailInfo.indexOf(".");
    const objectApiName = detailInfo.substr(0,index);
    const fieldApiName = detailInfo.substr(index+1);
    relatedList.push({objectApiName, fieldApiName})
  })
  return relatedList;
}


export const ObjectDetail = observer((props: any) => {
  let history = useHistory();
  const { appApiName, objectApiName, recordId } = props;
  const [tabActiveKey, setTabActiveKey] = useState<string>(`${objectApiName}-detail`);
  const [formMode] = useState<'read' | 'edit'>('read');
  const object:any = Objects.getObject(objectApiName);
  const recordCache = object.getRecord(recordId, [])
  if (object.isLoading || recordCache.isLoading) return (<ProSkeleton type="descriptions" />)
  const schema = object.schema;

  const relatedList = getRelatedList(schema);
  let title = '';
  let recordPermissions: any = null;
  let record: any = null;
  const formName = `form_${objectApiName}_${recordId}`;
  if(recordCache.data && recordCache.data.value && recordCache.data.value.length > 0){
    record = recordCache.data.value[0];
    recordPermissions = recordCache.permissions;
    title = record[schema.NAME_FIELD_KEY]
  }
  const extraButtons:any[] = [];
  const dropdownMenus: any[] = [];

  function setFormMode(value: string){
    let form = Forms.loadById(formName);
    form.setMode(value)
  }

  function deleteRecord(){
    recordCache.deleteRecord();
    history.push(`/app/${appApiName}/${objectApiName}`);
  }

  function afterUpdate(){
    message.success('修改成功');
    setFormMode('read');
    return true;
  }

  //编辑
  extraButtons.push(<Button key="editRecord" onClick={()=> setFormMode('edit')} type="primary">编辑</Button>)

  dropdownMenus.push(<Menu.Item key="deleteRecord" onClick={()=> deleteRecord()}>删除</Menu.Item>)

  if(schema.actions){
    _.each(schema.actions, function(action: any, actionApiName: string){
      let visible = false;
      
      if(_.isString(action._visible)){
        try {
          const visibleFunction = eval(`(${action._visible})`);
          visible = visibleFunction(objectApiName, recordId, recordPermissions, record)
        } catch (error) {
          // console.error(error, action._visible)
        }
      }

      if(_.isBoolean(action._visible)){
        visible = action._visible
      }

      if(visible && _.includes(['record', 'record_only'], action.on) && actionApiName != 'standard_edit'){
        extraButtons.push(<Button key={actionApiName} onClick={action.todo} type={actionApiName === 'standard_edit' ? "primary":"default"}>{action.label}</Button>)
      }
      if(visible && action.on === 'record_more'&& actionApiName != 'standard_delete'){
        dropdownMenus.push(<Menu.Item key={actionApiName} onClick={action.todo}>{action.label}</Menu.Item>)
      }
    })
  }
  const extra = [...extraButtons];
  if(dropdownMenus.length > 0){
    extra.push(<Dropdown
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
    </Dropdown>)
  }
  function itemRender(route, params, routes, paths) {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link to={route.path}>{route.breadcrumbName}</Link>
    );
  }

  function onTabChange(key){
    setTabActiveKey(key)
  }

  const tabList = [];
  tabList.push({tab: "详细信息", key: `${objectApiName}-detail`});
  relatedList.map((item, index) => {
    const object:any = Objects.getObject(item.objectApiName);
    if (object.isLoading) return ;
    tabList.push({tab: object.schema.label, key: `related-${item.objectApiName}-${item.fieldApiName}`});
  })

  if(!_.find(tabList, function(tab){return tab.key === tabActiveKey})){
    setTabActiveKey(`${objectApiName}-detail`)
  }

  return (
    <PageContainer content={false} title={false} header={{
      title: title,
      ghost: true,
      breadcrumb: {
        itemRender: itemRender,
        routes: [
          {
            path: `/app/${appApiName}/${objectApiName}`,
            breadcrumbName: '列表',
          },
          {
            path: '',
            breadcrumbName: '详细',
          },
        ],
      },
      extra: extra
    }}
    tabList={tabList}
    tabActiveKey={tabActiveKey}
    onTabChange={onTabChange}
>
    <Card style={{display: tabActiveKey===`${objectApiName}-detail` ? '': 'none'}} >
      <ObjectForm 
        layout='horizontal' 
        afterUpdate={afterUpdate} 
        recordId={recordId} 
        objectApiName={objectApiName} 
        name={formName} 
        mode={formMode} 
        submitter={{
              render: (_, dom) => <FooterToolbar style={{height: "64px", lineHeight:"64px"}}>{dom}</FooterToolbar>
              ,searchConfig: {
                resetText: '取消',
                submitText: '提交',
              },
              resetButtonProps: {
                onClick: () => {
                  setFormMode('read')
                },
              },
        }}/>
    </Card>
    {
      relatedList.map((item, index) => {
        const master = {objectApiName, recordId, relatedFieldApiName: item.fieldApiName};
        return (
          <div style={{display: tabActiveKey===`related-${item.objectApiName}-${item.fieldApiName}` ? '': 'none'}}  key={`card-${item.objectApiName}-${item.fieldApiName}`}>
            <RelatedList appApiName={appApiName} objectApiName={item.objectApiName} master={master} toolbar={toolbar} />
          </div>
        )
      })
    }
  </PageContainer>
  );
});