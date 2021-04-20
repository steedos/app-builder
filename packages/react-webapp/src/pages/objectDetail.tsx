import React, { useRef, useState } from 'react';
import ProLayout, { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { ObjectForm } from '@steedos/builder-object';
import { Button, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Forms, Objects } from '@steedos/builder-store';
import * as _ from 'lodash';
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";

export const ObjectDetail = observer((props: any) => {
  let history = useHistory();
  const { appApiName, objectApiName, recordId } = props;
  const [formMode] = useState<'read' | 'edit'>('read');
  const object:any = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div>Loading object ...</div>)
  const recordCache = object.getRecord(recordId, [])
  if (recordCache.isLoading) return (<div>Loading record ...</div>)
  const schema = object.schema ;
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
      <ObjectForm objectApiName={objectApiName} name={formName} mode={formMode} submitter={{
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>
      }}/>
  </PageContainer>
  );
});