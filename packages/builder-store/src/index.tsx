import { API } from './API';
import { Forms } from './Form';
import { Objects } from './Object';
import { Settings } from './Settings';
import { Apps } from './Apps'
import { User } from './User'
import { Queries } from './Queries';
const stores = {
  Forms,
  Objects,
  Settings,
  API,
  Apps,
  User,
  Queries,
};

// if (process.env.NODE_ENV !== 'production') {
  (window as any).stores = stores;
// }

export {
  Forms,
  Objects,
  Settings,
  API,
  Apps,
  User,
  Queries
}

export default stores;

declare global {
  interface Window {
      Creator: any
  }
}

window.Creator = {};
window.Creator.Objects = {};