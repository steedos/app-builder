import * as React from "react"
import ProForm, { ProFormText, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-form';

import { adapt } from "webcomponents-in-react";

import { Builder, BuilderComponent, builder, withChildren } from '@builder.io/react';

export default {
  title: "Ant Design",
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
    previewUrl: 'http://localhost:6006/iframe.html?id=pro-form--preview&viewMode=story',
  };

  const initialContent = {
    data: {
      blocks: [{
        "@type": "@builder.io/sdk:Element",
        "@version": 2,
        "id": "builder-0e6f5d94e39e41f0bc39bd42b55cd457",
        "component": {
          "name": "Text",
          "options": {
            "text": "<p>Steedos App Builder</p>"
          }
        },
      }]
    }
  }
  return (
    <BuilderEditor
      class="absolute top-0 right-0 bottom-0 left-0 width-full"
      onChange={(e:any) => {
        console.log(e)
      }}
      data={initialContent}
      env='production'
      options={builderOptions}/>
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
    previewUrl: 'http://localhost:6006/iframe.html?id=pro-form--preview&viewMode=story',
  };
  const builderData = {}
  return (
    <BuilderFiddle
      class="absolute top-0 right-0 bottom-0 left-0 width-full"
      onChange={(e:any) => {
        console.log(e)
      }}
      data={{}}
      env='production'
      options={builderOptions}/>
  ) 
}


export const Preview = () => {

  builder.init(apiKey);

  require('../src/builder-widgets');

  const context = {hello: 'context'}
  const data =  {
    initialValues: {name: 'Hello World!'},
    columns: 3,
  }
  const content = {} //require('./contract.form.builder.json');
  const bcProps = {
    apiKey,
    // content,
    context,
    data,
    onStateChange: (newData: any) => {
    }
  }
  return (
      <BuilderComponent {...bcProps}>
      </BuilderComponent> 
  )
}


export const FormContract = () => {

  require('../src/builder-widgets');

  builder.init(apiKey);

  const context = {
    formOptions: {
      columns: 1,
      initialValues: {name: 'Hello World!'},
      onFinish: (values) => {
        // console.log('onFinish 2')
        // console.log(values)
      },
    }
  }
  const data =  {
  }
  const content = require('./form-contract.builder.json');
  const bcProps = {
    apiKey,
    content,
    context,
    data,
    onStateChange: (newData: any) => {
    }
  }
  return (
    <BuilderComponent {...bcProps}>
    </BuilderComponent> 
  )
}


export const TableSimple = () => {

  require('../src/builder-widgets');

  builder.init(apiKey);

  const fieldSectionContent = require('./table-simple.builder.json');
  const data =  {
  }
  const bcProps = {
    apiKey,
    content: fieldSectionContent,
    data,
    onStateChange: (newData: any) => {
    }
  }

  return (
    <BuilderComponent {...bcProps}>
    </BuilderComponent> 
  )
}