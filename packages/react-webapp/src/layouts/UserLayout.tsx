import React from 'react';
import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { Link } from 'react-router-dom';
import { Login } from '../pages/user/login';
import styles from './UserLayout.less';
export default function UserLayout(props: any) {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  function formatMessage(arg0: { id: string; defaultMessage: string; }): string {
    return arg0.defaultMessage;
  }
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <IntlProvider locale="en" defaultLocale="en">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                {/* <img alt="logo" className={styles.logo} src="https://www.steedos.com/img/logo.png" /> */}
                <span className={styles.title}>Ant Design</span>
              </Link>
            </div>
            <div className={styles.desc}>
              <FormattedMessage
                id="pages.layouts.userLayout.title"
                defaultMessage="Ant Design 是西湖区最具影响力的 Web 设计规范"
              />
            </div>
          </div>
          <Login></Login>
        </div>
        <DefaultFooter />
      </div>
      </IntlProvider>
    </HelmetProvider>
  );
};
