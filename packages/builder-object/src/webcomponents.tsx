import React from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "./utils/react-to-webcomponent";
// import { ReactCustomElement, ReactCustomElementWithProps } from 'web-components-with-react';

import { ObjectForm } from './components/ObjectForm';
import { ObjectProvider } from './providers/ObjectProvider';

customElements.define(
  "object-form",
  reactToWebComponent(ObjectForm, React, ReactDOM)
);

customElements.define(
  "object-provider",
  reactToWebComponent(ObjectProvider, React, ReactDOM)
);

// customElements.define('object-provider', ReactCustomElementWithProps(ObjectProvider, ['locale', 'children'], false));
// customElements.define('object-form', ReactCustomElementWithProps(ObjectForm, ['object-api-name', 'mode'], false));
