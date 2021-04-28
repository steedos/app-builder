import {
  ChakraProvider,
  extendTheme,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import {
  BrowserRouter as Router
} from "react-router-dom";
import { StoryContext } from "@storybook/react"
import * as React from "react"
import { FaMoon, FaSun } from "react-icons/fa"
import { withPerformance } from "storybook-addon-performance"
// import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import ProProvider, {zhCNIntl} from '@ant-design/pro-provider';
import { Input, Space, Tag } from 'antd';

import {SteedosProvider} from '@steedos/builder-steedos';
import { SteedosIconSettings } from "../packages/builder-lightning/src/components/IconSettings";

// import "antd/dist/antd.css";
// import "@ant-design/pro-table/dist/table.css";
// import "@ant-design/pro-card/dist/card.css";
// import "@ant-design/pro-layout/dist/layout.css";

/**
 * Add global context for RTL-LTR switching
 */
export const globalTypes = {
  direction: {
    name: "Direction",
    description: "Direction for layout",
    defaultValue: "LTR",
    toolbar: {
      icon: "globe",
      items: ["LTR", "RTL"],
    },
  },
}

const ColorModeToggleBar = () => {
  const { toggleColorMode } = useColorMode()
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)
  const nextMode = useColorModeValue("dark", "light")

  return (
    <Flex justify="flex-end" mb={4}>
      <IconButton
        size="md"
        fontSize="lg"
        aria-label={`Switch to ${nextMode} mode`}
        variant="ghost"
        color="current"
        marginLeft="2"
        onClick={toggleColorMode}
        icon={<SwitchIcon />}
      />
    </Flex>
  )
}

const withChakra = (StoryFn: Function, context: StoryContext) => {
  const { direction } = context.globals
  const dir = direction.toLowerCase()
  return (
    <ChakraProvider theme={extendTheme({ direction: dir })}>
      <div dir={dir} id="story-wrapper" style={{ minHeight: "100vh" }}>
        <ColorModeToggleBar />
        <StoryFn />
      </div>
    </ChakraProvider>
  )
}

const withSFDS = (StoryFn: Function, context: StoryContext) => {

  return (
    <SteedosIconSettings>
      <StoryFn />
    </SteedosIconSettings>
  )
}

const withAntDesignPro = (StoryFn: Function, context: StoryContext) => {

  return (
    <ProProvider.Provider value={{
      intl: {
        ...zhCNIntl,
        locale: 'default',
      },
      valueTypeMap: {
        href: {
          render: (text) => <a>{text}</a>,
          renderFormItem: (text, props) => (
            <Input placeholder="请输入链接" {...props?.fieldProps} />
          ),
        }
      }
    }}>
      <StoryFn />
    </ProProvider.Provider>
  )
}

const withSteedos = (StoryFn: Function, context: StoryContext) => {

  const initialStore = {
    rootUrl: process.env.STEEDOS_ROOT_URL,
    tenantId: process.env.STEEDOS_TENANT_ID,
    userId: process.env.STEEDOS_USER_ID,
    authToken: process.env.STEEDOS_AUTH_TOKEN,
    currentObjectApiName: 'accounts',
    currentRecordId: process.env.STEEDOS_CURRENT_RECORD_ID,
    locale: 'zh_CN',
    forms: {},
    objects: {},
  }

  window['steedos'] = initialStore

  return (
    <SteedosProvider {...initialStore}>
      <Router>
        <StoryFn />
      </Router>
    </SteedosProvider>
  )
}


export const decorators = [withChakra, withPerformance, withSFDS, withSteedos]
