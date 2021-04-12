import React from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "react-to-webcomponent";
import { ReactCustomElement, ReactCustomElementWithProps } from 'web-components-with-react';

import { ObjectForm } from './components/ObjectForm';

// customElements.define(
//   "object-form",
//   reactToWebComponent(ObjectForm, React, ReactDOM)
// );

customElements.define('object-form', ReactCustomElementWithProps(ObjectForm, ['object-api-name', 'mode'], false));
