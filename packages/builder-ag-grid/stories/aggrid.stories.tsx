import { ObjectGrid} from "@steedos/builder-aggrid";
import { FieldSection } from "@steedos/builder-form";
import * as React from "react"
import { API } from '@steedos/builder-store';
import { Link } from "react-router-dom";
import { Modal, TreeSelect, Select, Input, Button } from "antd"
import ProCard from "@ant-design/pro-card"
import queryString from "querystring"
import { useEffect, useState } from "react";

export default {
  title: "Object Table AG Grid",
}

export const Grid = () => {
  return (
      <ObjectGrid objectApiName='accounts' 
        pagination={{
          pageSize:3
        }}
        sort="created desc,name desc"
        columnFields={
          [
            {
              fieldName: 'name'
            },
            {
              fieldName: 'parent_id'
            },
            {
              fieldName: 'rating'
            },
            {
              fieldName: 'type'
            },
            {
              fieldName: 'created'
            },
            {
              fieldName: 'created_by'
            },
          ]
        }
      >
        
      </ObjectGrid>
  )
}
