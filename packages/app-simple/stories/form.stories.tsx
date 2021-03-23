import * as React from "react";

import { Test, EmailInput } from "../src/index";
import { SteedosProvider } from "@steedos/builder-steedos";

export default {
  title: "AppSimple",
};

export const AppTest = () => {
  return (
    <SteedosProvider>
      {/* <Test /> */}

      <EmailInput />
    </SteedosProvider>
  );
};
