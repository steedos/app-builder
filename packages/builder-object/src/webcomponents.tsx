import React from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "./utils/react-to-webcomponent";

import { WebComponents } from '@steedos/builder-store';


Object.keys(WebComponents).forEach(element => {
  customElements.define(
    element,
    reactToWebComponent(WebComponents[element], React, ReactDOM)
  );
});
