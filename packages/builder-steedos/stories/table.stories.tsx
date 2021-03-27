import * as React from "react"
import { adapt } from "webcomponents-in-react";
import { BuilderComponent, builder } from '@builder.io/react';

import { SteedosProvider } from "../src/index"
import { useMst } from "@steedos/builder-store/src";

export default {
  title: "Steedos Table",
}


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
    previewUrl: 'http://localhost:6006/iframe.html?id=steedos-table--preview&viewMode=story',
  };
  const initialContent = {
    data: {
      blocks: [
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
          "id": "builder-7618a5cbfea2481e83915ec8e0b6232a",
          "component": {
            "name": "Steedos:RecordDetailPage",
            "options": {}
          },
          "children": [
            {
              "@type": "@builder.io/sdk:Element",
              "@version": 2,
              "id": "builder-56e5834326e840d98d3342efc273166d",
              "component": {
                "name": "Steedos:ObjectTable",
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
    previewUrl: 'http://localhost:6006/iframe.html?id=steedos-form--preview&viewMode=story',
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
  require('@steedos/builder-object/src/builder-widgets');
  // const context = {
  //   currentObjectApiName: "accounts",
  //   currentRecordId: ""
  // };
  console.log("====setCurrentObjectApiName==1=");
  const store = useMst();
  store.setCurrentObjectApiName("accounts");
  console.log("====setCurrentObjectApiName==2=", store.currentObjectApiName);
  const data = {
    initialValues: { name: 'Hello World!' },
    columns: 3,
  }
  const content = {} //require('./contract.form.builder.json');
  const bcProps = {
    apiKey,
    // content,
    // context,
    data,
    onStateChange: (newData: any) => {
    }
  }

  let initialState = {
    currentObjectApiName: "accounts"
  }

  return (
    <SteedosProvider initialState={initialState}>
      <BuilderComponent {...bcProps}>
      </BuilderComponent>
      <br /><br /><br />
    </SteedosProvider>
  )
}

export const TableSimple = () => {

  builder.init(apiKey);

  require('../src/builder-widgets');
  require('@steedos/builder-object/src/builder-widgets');
  // const store = useMst();
  // const { currentObjectApiName } = useMst();

  // store.setCurrentObjectApiName("accounts");
  const data = {
    initialValues: { name: 'Hello World!' },
    columns: 3,
    formMode: 'read'
  }
  const content = require('./table.builder.json');
  const bcProps = {
    apiKey,
    content,
    // context,
    data,
    onStateChange: (newData: any) => {
    }
  }

  let initialState = {
    currentObjectApiName: "accounts"
  }

  return (
    <SteedosProvider initialState={initialState}>
      <BuilderComponent {...bcProps}>
      </BuilderComponent>
      <br /><br /><br />
    </SteedosProvider>
  )
}


