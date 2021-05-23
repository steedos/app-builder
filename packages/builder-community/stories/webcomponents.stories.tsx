import * as React from "react"

import stores from '@steedos/builder-store';

require('../src/webcomponents');

export default {
  title: "Web Components",
}

export const Form = () => {
  stores.Settings.setRootUrl(process.env.STEEDOS_ROOT_URL)
  stores.Settings.setCurrentObjectApiName('accounts')
  return (
    <div>
        <object-form mode='read' object-api-name='accounts'>
        </object-form>
    </div>
  )
}