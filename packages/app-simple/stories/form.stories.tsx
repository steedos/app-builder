import * as React from "react"

import { Test } from "../src/index"
import { SteedosProvider } from "@steedos/builder-steedos"

export default {
  title: "AppSimple",
}

export const AppTest = () => {


  return (
    <SteedosProvider>
      <Test />
    </SteedosProvider>
  )
}


