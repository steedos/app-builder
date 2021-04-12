
import { ObjectForm, ObjectField, ObjectTable, ObjectTree, ObjectExpandTable } from "@steedos/builder-object";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"

import { Modal, TreeSelect, Select, Input, Button } from "antd"
import ProCard from "@ant-design/pro-card"
import queryString from "querystring"
import { useEffect, useState } from "react";
require('../src/webcomponents');

export default {
  title: "Web Components",
}

export const Form = () => {
  return (
    <div>
      <object-form mode='read' object-api-name='accounts'>
      </object-form>
    </div>
  )
}