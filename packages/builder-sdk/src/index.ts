
import { useFilters } from 'react-table';
import SteedosClient, {DEFAULT_LIMIT_AFTER, DEFAULT_LIMIT_BEFORE, HEADER_X_VERSION_ID} from './client4';

export {
  SteedosClient, DEFAULT_LIMIT_AFTER, DEFAULT_LIMIT_BEFORE, HEADER_X_VERSION_ID,
}

export * from "./filters";

declare global {
  interface Window {
      Creator: any
  }
  interface Window {
    Meteor: any,
    Session: any
  }
  interface Window {
    SteedosUI: any
  }
}
