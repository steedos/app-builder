
import React, { useContext } from "react";
import _ from 'lodash';
import { observer } from "mobx-react-lite"
// import { store } from '@steedos/builder-store/src';
import { useMst } from '@steedos/builder-store';

// type RecordDetailPageProps = {
//   objectApiName?: string,
//   recordId?: string,
//   children: any
// } 

export const RecordDetailPage = observer((props:any) => {
  // export function RecordDetailPage(props:RecordDetailPageProps) {
  const { children, ...rest } = props;
  let { currentObjectApiName, currentRecordId } = useMst();

  // const objectApiName = props.objectApiName ? props.objectApiName : currentObjectApiName as string;
  // const recordId = props.recordId ? props.recordId : currentRecordId;
  // console.log("=RecordDetailPage===objectApiName, recordId===", objectApiName, recordId);

  return (
      <div>
        {children}
      </div>
  )
});