import { API } from './API';
import { Forms } from './Form';
import { Objects } from './Object';
import { Settings } from './Settings';
import { User } from './User';
import { Apps } from './Apps'
import { Queries } from './Queries';
const stores = {
  Forms,
  Objects,
  Settings,
  API,
  User,
  Apps,
  Queries
};

// if (process.env.NODE_ENV !== 'production') {
  (window as any).stores = stores;
// }

export {
  Forms,
  Objects,
  Settings,
  API,
  User,
  Apps,
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