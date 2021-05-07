import React, { useRef } from "react"
import _ from "lodash"
import { ObjectListView, ObjectForm } from '@steedos/builder-object';
import {
  ActionType,
} from "@ant-design/pro-table"
import { observer } from "mobx-react-lite"
import { Objects } from "@steedos/builder-store"
import { Button, Dropdown, Menu, message } from 'antd';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Link, useParams } from "react-router-dom";
import ProSkeleton from '@ant-design/pro-skeleton';


function getButtons(schema, props, options){
  let { objectApiName, appApiName = "-", master} = props
  const title = schema.label;
  function afterInsert(result) {
    if(master && options && options.actionRef){
      options.actionRef.current.reload();
      return true;
    }
    if(result && result.length >0){
      const record = result[0];
      message.success('新建成功');
      if(options.history){
        options.history.push(`/app/${appApiName}/${objectApiName}/view/${record._id}`);
      }
      return true;
    }
  }

  let initialValues = null;
  if(master){
    initialValues = {
      [master.relatedFieldApiName]: master.recordId
    }
  }

  const extraButtons: any[] = [];
  const dropdownMenus: any[] = [];

  extraButtons.push(<ObjectForm initialValues={initialValues} key="standard_new" afterInsert={afterInsert} title={`新建 ${title}`} mode="edit" isModalForm={true} objectApiName={objectApiName} name={`form-new-${objectApiName}`} submitter={false} trigger={<Button type="primary" >新建</Button>}/>)
  _.each(schema.actions, function (action: any, actionApiName: string) {
      let visible = false;

      if (_.isString(action._visible)) {
          try {
              const visibleFunction = eval(`(${action._visible})`);
              visible = visibleFunction(objectApiName)
          } catch (error) {
              // console.error(error, action._visible)
          }
      }

      if (_.isBoolean(action._visible)) {
          visible = action._visible
      }

      if (visible && _.includes(['list'], action.on)) {
          if (extraButtons.length < 5) {
              extraButtons.push(<Button key={actionApiName} onClick={action.todo}>{action.label}</Button>)
          } else {
              dropdownMenus.push(<Menu.Item key={actionApiName} onClick={action.todo}>{action.label}</Menu.Item>)
          }
      }
  });
  return {
    extraButtons,
    dropdownMenus
  }
}

function getListViewDropdownMenus(schema, props, options){
  const listViews = [];
  _.each(schema.list_views, (_listView, key)=>{
    listViews.push(Object.assign({}, _listView, {name: key}))
  })
  let { objectApiName, appApiName = "-", master } = props;
  if(master){
    return null;
  }
  return (
    <Menu>
      {
        _.values(listViews).map((_listView, i) => (
          <Menu.Item key={_listView.name}>
            <Link to={`/app/${appApiName}/${objectApiName}/grid/${_listView.name}`}>{_listView.label}</Link>
          </Menu.Item>
        ))
      }
    </Menu>
  )
}


export const ListView = observer((props: any) => {
  const params: any = useParams();
  const { objectApiName, listName = "all" } = params;
  let {
    ...rest
  } = props
  
  const ref = useRef<ActionType>();
  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<ProSkeleton type="list" />)

  const schema = object.schema; 
  const title = schema.label;
  let listView = schema.list_views[listName];
  // const listViewColumns = getListviewColumns(schema, listName);
  const {extraButtons, dropdownMenus} = getButtons(schema, {
    objectApiName, listName, ...props
  }, {actionRef: ref, history: rest.history});
  const extra = [...extraButtons];
  if(dropdownMenus.length > 0){
    extra.push(<Dropdown
      // key="dropdown"
      trigger={['click']}
      overlay={
        <Menu>
          {dropdownMenus}
        </Menu>
      }
    >
      <Button style={{ padding: '0 8px' }}>
        <EllipsisOutlined />
      </Button>
    </Dropdown>)
  }

  const listViewDropdownMenus = getListViewDropdownMenus(schema, {
    objectApiName, listName, ...props
  }, {})

  // 切换对象时应该重置过滤条件
  ref.current && ref.current.reset();

  return (
    <PageContainer content={false} title={false} header={{
      title: title,
      subTitle:(listViewDropdownMenus ? <Dropdown overlay={listViewDropdownMenus}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          {listView.label} <DownOutlined />
        </a>
      </Dropdown> : null),
      ghost: true,
      extra: extra,
    }}>
      <ObjectListView
        actionRef={ref} 
        objectApiName={objectApiName}
        listName={listName}
        size="small"
        {...rest}
      />
    </PageContainer>
  )
})