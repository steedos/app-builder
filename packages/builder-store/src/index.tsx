import { API } from './API';
import { Forms } from './Form';
import { Tables } from './Table';
import { Objects } from './Object';
import { Settings } from './Settings';
import { Apps } from './Apps'
import { User } from './User'
import { Queries } from './Queries';
import { ComponentRegistry } from './ComponentRegistry';

const stores = {
  Forms,
  Tables,
  Objects,
  Settings,
  API,
  Apps,
  User,
  Queries,
  ComponentRegistry
};

// if (process.env.NODE_ENV !== 'production') {
  (window as any).stores = stores;
// }

export {
  Forms,
  Tables,
  Objects,
  Settings,
  API,
  Apps,
  User,
  Queries,
  ComponentRegistry
}

export default stores;

declare global {
  interface Window {
      Creator: any
  }
  interface Window {
    Meteor: any
  }
  interface Window {
    SteedosUI: any
  }
}

if(!window.Meteor){
  window.Creator = {};
  window.Creator.Objects = {};
}
