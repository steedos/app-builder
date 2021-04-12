export * from "./Object"
export * from "./Form"
export * from "./Settings"
export * from "./API"

import { Forms } from './Form';
import { Objects } from './Object';
import { Settings } from './Settings';

const stores = {
  Forms,
  Objects,
  Settings,
};

if (process.env.NODE_ENV !== 'production') {
  (window as any).stores = stores;
}

export default stores;
