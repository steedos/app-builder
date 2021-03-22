import * as React from "react"
import { adapt } from "webcomponents-in-react";
import { BuilderComponent, builder } from '@builder.io/react';

import {
  ObjectProvider
} from "../src/index"

import {
  FormProvider
} from "@steedos/builder-form/src"

export default {
  title: "Object Form",
}

import { SteedosClient }  from '@steedos/client';
import { result } from "lodash";
const {
  STEEDOS_ROOT_URL,
  STEEDOS_TENANT_ID,
  STEEDOS_USER_ID,
  STEEDOS_AUTH_TOKEN,
  STEEDOS_LOCALE = 'zh_CN'
} = process.env


declare var window;

const apiKey = 'e9ada5daeb6a4627bc2560d29916c080';

export const Editor = () => {

  if (!window.hasEditor) {
    const script = document.createElement("script");
    script.src = "https://cdn.builder.io/js/editor";
    script.async = true;
    document.body.appendChild(script);
    window.hasEditor = true;
  }

  const BuilderEditor = adapt("builder-editor");
  const builderOptions = {
    // useDefaultStyles: true,
    // hideAnimateTab: true,
    previewUrl: 'http://localhost:6006/iframe.html?id=object-form--preview&viewMode=story',
  };
  const initialContent = {
    "data": {
      "blocks": [
        {
          "@type": "@builder.io/sdk:Element",
          "@version": 2,
          "id": "builder-0e6f5d94e39e41f0bc39bd42b55cd457",
          "component": {
            "name": "Text",
            "options": {
              "text": "<p>Steedos App Builder</p>"
            }
          },
          "responsiveStyles": {
            "large": {
              "marginLeft": "auto",
              "marginRight": "auto",
              "fontSize": "20px"
            }
          }
        },
        {
          "@type": "@builder.io/sdk:Element",
          "@version": 2,
          "id": "builder-7d8f884ed829464e9b6e88e0a23c556b",
          "component": {
            "name": "Steedos:ObjectForm",
            "options": {}
          },
          "children": [
            {
              "@type": "@builder.io/sdk:Element",
              "@version": 2,
              "id": "builder-bf7ec9fe2dde409fbd422490900c5aa4",
              "component": {
                "name": "Steedos:ObjectField",
                "options": {}
              },
              "responsiveStyles": {
                "large": {
                  "display": "flex",
                  "flexDirection": "column",
                  "position": "relative",
                  "flexShrink": "0",
                  "boxSizing": "border-box",
                  "marginTop": "20px"
                }
              }
            }
          ],
          "responsiveStyles": {
            "large": {
              "display": "flex",
              "flexDirection": "column",
              "position": "relative",
              "flexShrink": "0",
              "boxSizing": "border-box",
              "marginTop": "20px"
            }
          }
        }
      ]
    }
  }
  return (
    <BuilderEditor
      class="absolute top-0 right-0 bottom-0 left-0 width-full"
      onChange={(e: any) => {
        console.log(e)
      }}
      data={initialContent}
      env='production'
      options={builderOptions} />
  )
}

export const Fiddle = () => {

  if (!window.hasFiddle) {
    const script = document.createElement("script");
    script.src = "https://cdn.builder.io/js/fiddle";
    script.async = true;
    document.body.appendChild(script);
    window.hasFiddle = true;
  }

  const BuilderFiddle = adapt("builder-fiddle");
  const builderOptions = {
    // useDefaultStyles: true,
    // hideAnimateTab: true,
    previewUrl: 'http://localhost:6006/iframe.html?id=object-form--preview&viewMode=story',
  };
  const builderData = {}
  return (
    <BuilderFiddle
      class="absolute top-0 right-0 bottom-0 left-0 width-full"
      onChange={(e: any) => {
        console.log(e)
      }}
      data={{}}
      env='production'
      options={builderOptions} />
  )
}


export const Preview = () => {

  builder.init(apiKey);

  // Builder.register('editor.settings', {
  //   hideStyleTab: false, // Hide the style tab
  //   hideMainTabs: true, // Hide all main tabs
  //   hideDataTab: false, // Hide the data tab
  //   hideOptionsTab: true, // Hide the options tab
  //   hideToolbar: false, // Hide the main toolbar
  //   hideHeatMap: true, // Hide the heatmap button
  //   hidePageUrlEditor: false, // Hide the page URL editor
  //   hideAnimateTab: true, // Hide the animate tab
  //   hideInsertTab: false, // Hide the insert tab
  //   hideTargeting: false, // Hide the targeting UI
  // });

  require('../src/builder-widgets');

  const context = {
    currentObjectApiName: "accounts",
    currentRecordId: ""
  };
  const data = {
    initialValues: { name: 'Hello World!' },
    columns: 3,
  }
  const content ={} //require('./object-field-form.builder.json');
  const bcProps = {
    apiKey,
    //content,
    context,
    data,
    onStateChange: (newData: any) => {
    }
  }

  const accountsJson = require('../../ui-components/stories/account.json')
  // const requestObject = async(objectApiName:string) => {
  //   //TODO 通过接口获取对象信息 /api/bootstrap/:spaceId/:objectName
  //   if(!objectApiName){
  //     return;
  //   }
  //   const object = await client.sobject(objectApiName).getConfig();
  //   return object;
  // }

  // const requestRecords = async( objectApiName:string, filters:any, fields:any , options:any) => {
  //   const records = await client.sobject(objectApiName).find(filters, fields);
  //   console.log('-----requestRecords-----', records);
  //   return records;

  // }

    // const updateRecord = {async (objectApiName, objectRecordId, data) => {
    //   const result = await client.sobject(objectApiName).update(objectRecordId, data);

    //   return result
    // }
  return (
    <ObjectProvider
      currentObjectApiName={context.currentObjectApiName}
      // requestObject={requestObject}
      // requestRecords={requestRecords}
      // updateRecord={updateRecord}
      requestObject={async (objectApiName) => {
        //objectApiName:对象api名称
        console.log("==in function==", objectApiName);
        return accountsJson;
      }}
      requestRecords={async (objectApiName, filters, fields, options) => {
        //objectApiName:对象api名称
        //filters: 过滤条件
        //fields: 要返回的字段
        return [{
          name:'test',
          type:'Analyst',
          number_of_employees: 10,
          description: '这是描述信息',
          email: '123@qq.com',
          industry: 'Engineering',
          rating : 'Warm',
          salutation : 'Female',
          startdate__c : '2021-03-15',
          datetime__c: '2021-03-15 11:30:00',
          state : 'SH',
          summary__c : 3,
          website : '123.com',
          annual_revenue: 56123,
          fn__c: 56123
        }]
      }}
      updateRecord = {async (objectApiName, objectRecordId, data) => {
        //objectApiName:对象api名称
        //objectRecordId: recordId
        //data:表单提交Data
        return []
      }}
    >
      <FormProvider locale="zh_CN">
        <BuilderComponent {...bcProps}>
        </BuilderComponent>
      </FormProvider>
      <br /><br /><br />
    </ObjectProvider>
  )
}

const client = new SteedosClient();
  
client.setUrl(STEEDOS_ROOT_URL)
client.setUserId(STEEDOS_TENANT_ID)
client.setToken(STEEDOS_AUTH_TOKEN);
client.setSpaceId(STEEDOS_USER_ID);

export const ObjectFormSimple = () => {

  require('../src/builder-widgets');

  builder.init(apiKey);

  const fieldSectionContent = require('./form.builder.json');
  const data = {
    formMode: 'read',
  }
  const bcProps = {
    apiKey,
    content: fieldSectionContent,
    data,
    onStateChange: (newData: any) => {
    }
  }

  const accountsJson = require('../../ui-components/stories/account.json')
  return (
    <ObjectProvider
      currentObjectApiName="accounts"
      requestObject={async (objectApiName) => {
        //objectApiName:对象api名称
        //console.log("==in function==", objectApiName);
        return accountsJson;
      }}
      requestRecords={async (objectApiName, filters, fields, options) => {
        //objectApiName:对象api名称
        //filters: 过滤条件
        //fields: 要返回的字段
        return [{
          name:'test',
          type:'Analyst',
          number_of_employees: 10,
          description: '这是描述信息',
          email: '123@qq.com',
          industry: 'Engineering',
          rating : 'Warm',
          salutation : 'Female',
          startdate__c : '2021-03-15',
          datetime__c: '2021-03-15 11:30:00',
          state : 'SH',
          summary__c : 3,
          website : '123.com',
          annual_revenue: 56123,
          fn__c: 56123
        }]
      }}
      updateRecord = {async (objectApiName, objectRecordId, data) => {
        //objectApiName:对象api名称
        //objectRecordId: recordId
        //data:表单提交Data
        return []
      }}
    >
      <BuilderComponent {...bcProps}>
      </BuilderComponent>
      <br /><br /><br />
    </ObjectProvider>
  )
}

