import { API } from './API';
import { Forms } from './Form';
import { Objects } from './Object';
import { Settings } from './Settings';

const stores = {
  Forms,
  Objects,
  Settings,
  API,
};

// if (process.env.NODE_ENV !== 'production') {
  (window as any).stores = stores;
// }

export {
  Forms,
  Objects,
  Settings,
  API,
}

export default stores;
