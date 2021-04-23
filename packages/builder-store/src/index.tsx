import { API } from './API';
import { Forms } from './Form';
import { Objects } from './Object';
import { Settings } from './Settings';
import { User } from './User';
import { Apps } from './Apps'
const stores = {
  Forms,
  Objects,
  Settings,
  API,
  User,
  Apps
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
  Apps
}

export default stores;
