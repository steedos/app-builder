import { API } from './API';
import { Forms } from './Form';
import { Objects } from './Object';
import { Settings } from './Settings';
import { User } from './User';

const stores = {
  Forms,
  Objects,
  Settings,
  API,
  User
};

// if (process.env.NODE_ENV !== 'production') {
  (window as any).stores = stores;
// }

export {
  Forms,
  Objects,
  Settings,
  API,
  User
}

export default stores;
