
import React, { useContext } from "react";
import _ from 'lodash';
import { observer } from "mobx-react-lite"
import { store } from '@steedos/builder-store/src';

export type RecordDetailPageProps = {
  objectApiName?: string,
  recordId?: string,
  children: any
} 

export const RecordDetailPage = observer((props:RecordDetailPageProps) => {
  // export function RecordDetailPage(props:RecordDetailPageProps) {
  const { children, ...rest } = props;
  let { currentObjectApiName, currentRecordId } = store;

  const objectApiName = props.objectApiName ? props.objectApiName : currentObjectApiName as string;
  const recordId = props.recordId ? props.recordId : currentRecordId;
  console.log("=RecordDetailPage===objectApiName, recordId===", objectApiName, recordId);

  return (
      <div>
        {children}
      </div>
  )
});