import React, { useRef, useState } from 'react';
import ProLayout, { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { ObjectTable, ObjectForm } from '@steedos/builder-object';
import { Objects } from '@steedos/builder-store';
import { Button, Dropdown, Menu, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";

export const ObjectListView = observer((props: any) => {
  let history = useHistory();
    // const [formVisible, setFormVisible] = useState(false);

    const { appApiName, objectApiName } = props;
    const object: any = Objects.getObject(objectApiName);
    if (object.isLoading) return (<div>Loading object ...</div>)
    const schema = object.schema;
    const title = object.schema.label;

    const extraButtons: any[] = [];
    const dropdownMenus: any[] = [];

    function afterInsert(result) {
      if(result && result.length >0){
        const record = result[0];
        message.success('新建成功');
        history.push(`/app/${appApiName}/${objectApiName}/view/${record._id}`);
        return true;
      }
    }

    //新增
    extraButtons.push(<ObjectForm key="standard_new" afterInsert={afterInsert} title={`新建 ${title}`} mode="edit" isModalForm={true} objectApiName={objectApiName} name={`form-new-${objectApiName}`} submitter={false} trigger={<Button type="primary" >新建</Button>}/>)

    //   dropdownMenus.push(<Menu.Item key="deleteRecord" onClick={()=> deleteRecord()}>删除</Menu.Item>)

    if (schema.actions) {
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
        })
    }

    return (
        <>
        <PageContainer content={false} title={false} header={{
            title: title,
            ghost: true,
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
          }}>
            <ObjectTable objectApiName={objectApiName} columnFields={[{ fieldName: "name" }]} />
        </PageContainer>
    </>
    );
});