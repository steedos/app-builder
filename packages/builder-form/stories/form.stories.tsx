import * as React from "react"
import ProForm, { ProFormText, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-form';
const yaml = require('js-yaml');
const fs   = require('fs');

import { adapt } from "webcomponents-in-react";

import { Builder, BuilderComponent, builder, withChildren, BuilderStoreContext } from '@builder.io/react';

import { Form } from '../src/components/Form'
import { useContext } from "react";
import {
  FormProvider
} from "../src/"
export default {
  title: "Builder Form",
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
    previewUrl: 'http://localhost:6006/iframe.html?id=builder-form--preview&viewMode=story',
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
    previewUrl: 'http://localhost:6006/iframe.html?id=builder-form--preview&viewMode=story',
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
    <FormProvider locale="zh_CN">
      <BuilderComponent {...bcProps}>
      </BuilderComponent> 
    </FormProvider>
  )
}




export const FormFieldSection = () => {

  require('../src/builder-widgets');

  builder.init(apiKey);

  const fieldSectionContent = require('./form-field-section.builder.json');
  const data =  {
    formMode: 'read',
  }
  const bcProps = {
    apiKey,
    content: fieldSectionContent,
    data,
    onStateChange: (newData: any) => {
    }
  }
  return (
    <Form initialValues={{name: 'Hello World'}} onFinish={(values)=>{
      console.log(values)
    }}>
      <BuilderComponent {...bcProps}>
      </BuilderComponent> 
    </Form>
  )
}


export const FormVertical= () => {

  require('../src/builder-widgets');

  builder.init(apiKey);

  const fieldSectionContent = require('./form-field-section.builder.json');
  const data =  {
    formMode: 'read',
  }
  const bcProps = {
    apiKey,
    content: fieldSectionContent,
    data,
    onStateChange: (newData: any) => {
    }
  }

  const initialValues = {
    href: "http://www.baidu.com"
  };
  return (
    <FormProvider locale="zh_CN">
      <Form layout='vertical' name='test' initialValues={initialValues} onFinish={(values)=>{
        console.log(values)
        const store = useContext(BuilderStoreContext)
        store.update((state:any) => {
          state.formMode = 'read'
        })
      }}>
        <BuilderComponent {...bcProps}>
        </BuilderComponent> 
      </Form>
    </FormProvider>
  )
}



export const TableSimple = () => {

  require('../src/builder-widgets');

  builder.init(apiKey);

  const content = require('./table-simple.builder.json');
  // const content = yaml.load(fs.readFileSync(__dirname + '/table-simple.builder.yml', 'utf8'));
  const data =  {
    formMode: 'read',
  }
  const bcProps = {
    apiKey,
    content,
    data,
    onStateChange: (newData: any) => {
    }
  }
  return (
      <BuilderComponent {...bcProps}>
      </BuilderComponent> 
  )
}

