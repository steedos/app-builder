
import React from "react";

import { getSnapshot } from "mobx-state-tree";
import { SteedosClient } from '@steedos/builder-sdk';
import { FormProvider } from "@steedos/builder-form";
import { QueryClient, QueryClientProvider } from "react-query";
import { Settings, API, ComponentRegistry } from "@steedos/builder-store";
import { SteedosIconSettings } from "@steedos/builder-lightning";
import { StandardValueTypes } from '../valueTypes'
import { SteedosContext } from './SteedosContext';
import { observer } from "mobx-react-lite";

const defaultQueryClientConfig: any = {
  defaultOptions: {
    queries:{
      refetchOnWindowFocus: false
    }
  }
}

ComponentRegistry.valueTypes = StandardValueTypes;

/*
参数：
- locale: zh_CN, en_US, zh_TW  TODO: 和steedos的locale值不一样，获取user之后需要转换。

*/
export const SteedosProvider = (props: any) => {

  const {
    rootUrl,
    tenantId = localStorage.getItem('steedos:spaceId'),
    userId = localStorage.getItem('steedos:userId'),
    authToken = localStorage.getItem('steedos:token'),
    queryClient = new QueryClient(defaultQueryClientConfig),
    locale,
    iconPath,
  } = props;

  Settings.setRootUrl(rootUrl);
  Settings.setTenantId(tenantId);
  Settings.setUserId(userId);
  Settings.setAuthToken(authToken);
  Settings.setLocale(locale);


  return (
    <SteedosContext.Provider value={{}}>
      <SteedosIconSettings iconPath={iconPath}>
        <QueryClientProvider client={queryClient}>
          <FormProvider locale={locale} valueTypeMap={ComponentRegistry.valueTypes}>
            {props.children}
          </FormProvider>
        </QueryClientProvider>
      </SteedosIconSettings>
    </SteedosContext.Provider>
  )
};