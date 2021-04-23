import { Tooltip, Tag } from 'antd';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { AvatarDropdown  } from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { Space } from 'antd';
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";

export const RightContent = observer((props: any) => {
  let history = useHistory();
  const { theme, layout } = props;
  console.log(`RightContent styles`, styles, styles.right);
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={value => {
        //   //console.log('input', value);
        // }}
      /> */}
      <Space style={{height: "100%"}}>
      <Tooltip title="使用文档">
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          href="https://www.steedos.com/help/"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined />
        </a>
      </Tooltip>
      <AvatarDropdown />
      </Space>
      {/* <SelectLang className={styles.action} /> */}
    </div>
  );
})