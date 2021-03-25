import * as React from "react"

import { AppTest } from "../src/components/AppTest"
import { SteedosProvider } from "@steedos/builder-steedos"

import "antd/dist/antd.css"
import "@ant-design/pro-table/dist/table.css"
import "@ant-design/pro-card/dist/card.css"
import "@ant-design/pro-layout/dist/layout.css"

export default {
  title: "AppSimple",
}

export const App = () => {
  return (
    <SteedosProvider>
      {/* <Test /> */}
      {/* <EmailInput /> */}
      <AppTest />
    </SteedosProvider>
  )
}
