import _ from 'lodash';

export function getObjectRecordUrl(objectApiName: string, redordId: any) {
  const hrefPrefix = `/app/-/${objectApiName}/view/`;
  return `${hrefPrefix}${redordId}`;
}