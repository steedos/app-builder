import React from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "./utils/react-to-webcomponent";

import { ObjectForm } from '@steedos/builder-object';

export const WebComponents = {
  'object-form': ObjectForm,
}

Object.keys(WebComponents).forEach(element => {
  customElements.define(
    element,
    reactToWebComponent(WebComponents[element], React, ReactDOM)
  );
});
