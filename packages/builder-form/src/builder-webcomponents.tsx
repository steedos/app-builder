import React from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "react-to-webcomponent";

import { Form } from './components/Form';
import { Field } from './components/Field';

customElements.define(
  "pro-form",
  reactToWebComponent(Form, React, ReactDOM)
);

customElements.define(
  "pro-field",
  reactToWebComponent(Field, React, ReactDOM)
);
