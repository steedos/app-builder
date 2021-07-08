import { isArray, isNil } from 'lodash';

export const safeRunFunction = (fun: any, args: any, defaultValue?: any, _this?: any) => {
  try {
    let params = [];
    if(!isNil(args)){
      params = isArray(args) ? args : [args] ;
    }
    return fun.bind(_this || {})(...params);
  } catch (error) {
    console.log(error);
    return defaultValue;
  }
}

export const BASE_FIELDNAMES_FOR_PERMISSIONS = ["owner", "company_id", "company_ids", "locked"];