import React from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "react-to-webcomponent";

import { ObjectForm } from './components/ObjectForm';

customElements.define(
  "object-form",
  reactToWebComponent(ObjectForm, React, ReactDOM)
);