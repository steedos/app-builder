import React,{ useState, useMemo, useRef, useEffect } from "react"
import { useResizeObserver } from "../utils/use-resize-observer";
import { SpaceUsers, SpaceUsersProps, ObjectModal, ObjectModalProps, Organizations } from ".."
import { omit } from "lodash"
import "./SpaceUsersModal.less"
import useAntdMediaQuery from 'use-media-antd-query';

export type SpaceUsersModalProps = {
} & SpaceUsersProps & Omit<ObjectModalProps, 'contentComponent'>

export const SpaceUsersModal = ({
  columnFields,
  ...rest
}: SpaceUsersModalProps) => {
  let props = {
    columnFields
  };
  const colSize = useAntdMediaQuery();
  const isMobile = (colSize === 'sm' || colSize === 'xs');
  let expandProps:any;
  if(!isMobile){
    expandProps={
      expandComponent: Organizations,
      expandReference: "organizations",
      expandNameField: "name",
      expandParentField: "parent",
    }
  }
  if(!props.columnFields){
    props.columnFields = [{
      fieldName: "name",
      hideInSearch: true,
      sorter: true,
    },{
      fieldName: "email",
      hideInSearch: true,
    },{
      fieldName: "user",
      hideInSearch: true,
      hideInTable: true,
    },{
      fieldName: "organizations_parents",
      hideInTable: true,
      hideInSearch: true,
      ...expandProps,
    }]
  }

  let width = isMobile ? '100%' : '80%'; 
  let style={ 
    maxWidth: '1200px', 
    minWidth: '800px', 
    // TODO: modal高度设置，200px后续要修改成灵活设置的变量值
    height: 'calc(100% - 200px)',
    overflow: 'hidden'
  }
  let modalPropsStyle = isMobile ? null : style;
  return (
    <ObjectModal
      width={width}
      modalProps={
        modalPropsStyle
      }
      contentComponent={SpaceUsers}
      {...props}
      {...omit(rest, ['objectApiName', 'contentComponent'])}
    />
  )
}
