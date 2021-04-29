import React, { useRef } from 'react';
import { ObjectForm } from '@steedos/builder-object';
import { Button, message } from 'antd';
import { Objects } from '@steedos/builder-store';
import * as _ from 'lodash';
import { observer } from "mobx-react-lite";
import ProSkeleton from '@ant-design/pro-skeleton';
import {
  ActionType,
} from "@ant-design/pro-table"

import { ObjectListView } from '@steedos/builder-object';

export const RelatedList = observer((props: any) => {
  const ref = useRef<ActionType>();
  const { appApiName, objectApiName, master} = props;

  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<ProSkeleton type="list" />)

  const schema = object.schema; 
  const title = schema.label;
  
  const getRelatedListActions = (master: any, actionRef?: any)=>{
    let initialValues = null;
    if(master){
      initialValues = {
        [master.relatedFieldApiName]: master.recordId
      }
    }
    function afterInsert(result: any) {
      message.success('新建成功');
      if(master && actionRef){
        actionRef.current.reload();
        return true;
      }
    }

    let buttons = [];
    buttons.push(<ObjectForm initialValues={initialValues} key="standard_new" afterInsert={afterInsert} title={`新建 ${title}`} mode="edit" isModalForm={true} objectApiName={objectApiName} name={`form-new-${objectApiName}`} submitter={false} trigger={<Button type="primary" >新建</Button>}/>)
    return buttons;
  }

  const toolbar = {
    actions: getRelatedListActions(master, ref)
  }
  return (
    <ObjectListView search={false} appApiName={appApiName} objectApiName={objectApiName} master={master} toolbar={toolbar} actionRef={ref} />
  )
});