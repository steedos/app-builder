import _ from 'lodash';
import { Apps } from '@steedos/builder-store';
export function getObjectRecordUrl(objectApiName: string, redordId: any) {
  const hrefPrefix = `/app/${Apps.currentAppId}/${objectApiName}/view/`;
  return `${hrefPrefix}${redordId}`;
}