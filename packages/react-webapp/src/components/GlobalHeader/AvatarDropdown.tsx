import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import { API, Settings, User } from '@steedos/builder-store';
export const AvatarDropdown = observer((props: any) => {
  let history = useHistory();
  const onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;
    if (key === 'logout') {
      User.logout();
      return;
    }
    history.push(`/account/${key}`);
  };
  const {
    currentUser = {
      name: User.me?.name,
      avatar: `${API.client.getUrl()}/avatar/${Settings.userId}`,
    },
    menu,
  } = props;
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
            个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
            个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
          退出登录
        </Menu.Item>
    </Menu>
  );
  return currentUser && currentUser.name ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span style={{paddingLeft: '4px'}}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
});
