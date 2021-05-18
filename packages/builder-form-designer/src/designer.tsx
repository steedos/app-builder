import React from 'react';
import Generator from 'fr-generator';
import { getSettings, getCommonSettings } from './settings';
import { widgets } from './widgets';

const defaultValue = {
  schema: {
    type: 'object',
    properties: {
      // inputName: {
      //   title: '简单输入框',
      //   type: 'string',
      // },
    },
  },
  displayType: 'row',
  showDescIcon: true,
  labelWidth: 120,
};

export const FormDesigner = (props) => {
  const {objectApiName, ...rest} = props;
  const settings = getSettings(objectApiName)
  const commonSettings = getCommonSettings();
  return (
    <div style={{ height: '80vh' }}>
      <Generator 
        widgets={widgets}
        settings={settings}
        commonSettings={commonSettings}
        defaultValue={defaultValue} 
        {...rest}
        />
    </div>
  );
};
