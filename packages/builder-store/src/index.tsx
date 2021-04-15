import { API } from './API';
import { Forms } from './Form';
import { Objects } from './Object';
import { Settings } from './Settings';
import { WebComponents } from './WebComponents';

const stores = {
  Forms,
  Objects,
  Settings,
  API,
  WebComponents
};

// if (process.env.NODE_ENV !== 'production') {
  (window as any).stores = stores;
// }

export {
  Forms,
  Objects,
  Settings,
  API,
  WebComponents
}

export default stores;
