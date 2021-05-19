import React from 'react';
import Generator from 'fr-generator';
import { getSettings, getCommonSettings } from './settings';
import { widgets } from './widgets';
import { fromSteedosObject, toSteedosObject } from './transformer/steedos-object';

const defaultValue = {
  schema: {
    type: 'object',
    properties: {
    },
  },
  displayType: 'row',
  showDescIcon: true,
  labelWidth: 120,
};

export const FormDesigner = (props) => {
  const {objectApiName, ...rest} = props;
  const settings = getSettings()
  const commonSettings = getCommonSettings();
  return (
    <div style={{ height: '80vh' }}>
      <Generator 
        widgets={widgets}
        settings={settings}
        commonSettings={commonSettings}
        defaultValue={defaultValue} 
        transformer={{
          from: fromSteedosObject,
          to: toSteedosObject,
        }}
        {...rest}
        />
    </div>
  );
};
