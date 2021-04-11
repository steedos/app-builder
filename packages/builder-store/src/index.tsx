export * from "./Object"
export * from "./Form"
export * from "./Table"
export * from "./Root"
export * from "./Settings"
export * from "./API"

import { Objects } from './Object';
import { Settings } from './Settings';

const stores = {
  Objects,
  Settings,
};

if ((window as any).steedos && process.env.NODE_ENV !== 'production') {
  (window as any).steedos.stores = stores;
}

export default stores;
