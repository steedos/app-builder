import React, { useRef, useState } from 'react';
import ProLayout, { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { ObjectTable, ObjectForm } from '@steedos/builder-object';
import { Objects } from '@steedos/builder-store';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import { observer } from "mobx-react-lite";

export const ObjectListView = observer((props: any) => {

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
  
    const showModal = () => {
      setVisible(true);
    };
  
    const handleOk = () => {
      setModalText('The modal will be closed after two seconds');
      setConfirmLoading(true);
      setTimeout(() => {
        setVisible(false);
        setConfirmLoading(false);
      }, 2000);
    };
  
    const handleCancel = () => {
      console.log('Clicked cancel button');
      setVisible(false);
    };
    const { appApiName, objectApiName } = props;
    const object: any = Objects.getObject(objectApiName);
    if (object.isLoading) return (<div>Loading object ...</div>)
    const schema = object.schema;
    const title = object.schema.label;

    const extraButtons: any[] = [];
    const dropdownMenus: any[] = [];

    function newRecord() {
        showModal()
    }

    //新增
    extraButtons.push(<ObjectForm title={`新建 ${title}`} mode="edit" isModalForm={true} objectApiName={objectApiName} name={`new-${objectApiName}`} trigger={<Button type="primary">新建</Button>}/>)

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
            // breadcrumb: {
            //   routes: [
            //     {
            //       path: `/app/${appApiName}`,
            //       breadcrumbName: '列表',
            //     },
            //     {
            //       path: '',
            //       breadcrumbName: '详细',
            //     },
            //   ],
            // },
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