import React, { useContext } from "react";
import { FormContext } from './FormContext';
import valueTypes from '../valueTypes';

import ProContext, {createIntl, 
  zhCNIntl as pro_zhCN, 
  zhTWIntl as pro_zhTW, 
  enUSIntl as pro_enUS
} from '@ant-design/pro-provider';

import { ConfigProvider as AntdConfigProvider } from 'antd';
import antd_zhCN from 'antd/es/locale/zh_CN';
import antd_zhTW from 'antd/es/locale/zh_TW';
import antd_enUS from 'antd/es/locale/zh_CN';

import { IntlType } from "@ant-design/pro-table";

import { en_US, zh_CN } from '@steedos/builder-locale';

/* 通过 valueTypeMap，支持给Form传入第三方自定义控件 */
type FormProviderProps = {
  locale?: string,
  valueTypeMap?: object,
  children: any,
}

export function FormProvider(props: FormProviderProps) {
  const {
    locale,
    valueTypeMap,
    children,
  } = props

  const proContextValues = {
    intl: {
      ...getProLocale(locale),
    },
    valueTypeMap: { ...valueTypes, ...valueTypeMap }
  }

  const antdContextValues = {
    locale: getAntdLocale(locale)
  }

  const intl = getSteedosIntl(locale)
  return (
    <FormContext.Provider value={{
      intl,
      valueTypeMap
    }}>
      <AntdConfigProvider {...antdContextValues}>
        <ProContext.Provider value={proContextValues}>
          {children}
        </ProContext.Provider>
      </AntdConfigProvider>
    </FormContext.Provider>
  )
}


export const getAntdLocale:any = (locale: string)=> {
  switch (locale) {
    case 'en_US': return antd_enUS
    case 'zh_CN': return antd_zhCN
    case 'zh_TW': return antd_zhTW
    default: return antd_zhCN
  }
}

export const getProLocale = (locale?: string)=> {
  switch (locale) {
    case 'en_US': return pro_enUS
    case 'zh_CN': return pro_zhCN
    case 'zh_TW': return pro_zhTW
    default: return pro_zhCN
  }
}

function getMessageFromLocaleMap(
  source: Record<string, unknown>,
  path: string,
  defaultValue?: string,
): string | undefined {
  // a[3].b -> a.3.b
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = source;
  let message = defaultValue;
  // eslint-disable-next-line no-restricted-syntax
  for (const p of paths) {
    message = Object(result)[p];
    result = Object(result)[p];
    if (message === undefined) {
      return defaultValue;
    }
  }
  return message;
}

/**
 * 创建一个操作函数
 *
 * @param locale
 * @param localeMap
 */
const createSteedosIntl = (locale: string, localeMap: Record<string, any>): IntlType => ({
  getMessage: (id: string, defaultMessage: string) => {
    let message = getMessageFromLocaleMap(localeMap, id, defaultMessage);
    if (!message)
      message = getProLocale(locale).getMessage(id, '');
      if (!message)
        message = getMessageFromLocaleMap(getAntdLocale(locale), id);
    return message || defaultMessage
  },
  locale,
});

const zhCNIntl = createSteedosIntl('zh_CN', zh_CN);
const enUSIntl = createSteedosIntl('en_US', en_US);

const getSteedosIntl = (locale?: string) => {
  switch (locale) {
    case 'en_US': return enUSIntl
    case 'zh_CN': return zhCNIntl
    case 'zh_TW': return zhCNIntl
    default: return zhCNIntl
  }
}

export function useIntl(): IntlType {
  const context = useContext(FormContext);
  return context.intl || zhCNIntl;
}
