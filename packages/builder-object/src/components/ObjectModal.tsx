import React, { useState, useEffect, useContext, useMemo, useRef } from "react"
import { Modal, ConfigProvider } from "antd"
import { 
  ObjectTable, ObjectTableProps, 
  ObjectExpandTable, ObjectExpandTableProps, 
  ObjectTree, ObjectTreeProps,
  ObjectListView, ObjectModalListView, ObjectListViewProps, 
  Organizations, OrganizationsProps,
  SpaceUsers, SpaceUsersProps,
} from ".."
import { createPortal } from 'react-dom';
import { omit, isArray } from "lodash"
import type { ModalProps } from 'antd';
import "./ObjectModal.less"
import useAntdMediaQuery from 'use-media-antd-query';

export type ObjectModalProps = {
  isDrawer?: boolean
  trigger?: JSX.Element
  onFinish?: (value: any) => Promise<boolean | void>
  onChange?: (value: any) => void
  visible?: ModalProps['visible']
  onVisibleChange?: (visible: boolean) => void
  modalProps?: Omit<ModalProps, 'visible'>
  title?: ModalProps['title']
  width?: ModalProps['width']
  contentComponent: React.FunctionComponent,
  multiple?: any
  value?: any
} & ObjectTableProps<any> & ObjectExpandTableProps & ObjectTreeProps & ObjectListViewProps<any>
  & OrganizationsProps & SpaceUsersProps

export const ObjectModal = ({
  isDrawer = false,
  trigger,
  onFinish,
  onVisibleChange,
  modalProps,
  title,
  width,
  onChange,
  contentComponent: ContentComponent,
  multiple,
  value,
  tableMode = "ag-grid",//ag-grid, ant-pro-table
  ...rest
}: ObjectModalProps) => {
  const defaultValue = (value && value.length && (isArray(value) ? value : [value])) || []
  const [selectedRowKeys, setSelectedRowKeys] = useState(defaultValue)
  const [selectedRows, setSelectedRows] = useState([])
  const [visible, setVisible] = useState<boolean>(!!rest.visible);
  const context = useContext(ConfigProvider.ConfigContext);
  const colSize = useAntdMediaQuery();
  const isMobile = (colSize === 'sm' || colSize === 'xs');
  const { style, ...restModalProps } = modalProps || {};

  // 设置默认值
  ContentComponent = ContentComponent ? ContentComponent : ObjectModalListView;

  const handleOnChange = (keys: any, rows: any) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
    onChange && onChange(selectedRowKeys, selectedRows);
  }

  const renderDom = useMemo(() => {
    if (modalProps?.getContainer) {
      if (typeof modalProps?.getContainer === 'function') {
        return modalProps?.getContainer?.();
      }
      if (typeof modalProps?.getContainer === 'string') {
        return document.getElementById(modalProps?.getContainer);
      }
      return modalProps?.getContainer;
    }
    return context?.getPopupContainer?.(document.body);
  }, [context, modalProps, visible]);

  let contentComponentProps: any = {};
  if([ObjectTable, ObjectExpandTable, ObjectListView, ObjectModalListView, SpaceUsers].indexOf(ContentComponent) > -1){
    // console.log([ObjectTable, ObjectExpandTable, ObjectListView, ObjectModalListView, SpaceUsers].indexOf(ContentComponent))
    // 底层使用的是ObjectTable 或 ag-grid时multiple及value属性实现逻辑
    if(tableMode === "ag-grid"){
      let rowSelectionType="single";
      if (multiple){
          rowSelectionType="multiple";
      }
      Object.assign(contentComponentProps, {
        rowSelection: rowSelectionType
      });
    }else{
      let rowSelectionType="radio";
      if (multiple){
          rowSelectionType="checkbox";
      }
      Object.assign(contentComponentProps, {
        rowSelection: {
          type: rowSelectionType ,
          // 在proTable中defaultSelectedRowKeys目前无效。只能用selectedRowKeys实现相关功能。
          // 如果proTable后续版本defaultSelectedRowKeys能生效的话可以考虑直接换成defaultSelectedRowKeys。
          selectedRowKeys: isArray(value) ? value : [value]
        }
      });
    }
  }
  else if([ObjectTree, Organizations].indexOf(ContentComponent) > -1){
    // 底层使用的是ObjectTree时multiple及value属性实现逻辑
    Object.assign(contentComponentProps, {
      multiple,
      defaultSelectedKeys: isArray(value) ? value : [value]
    });
  }
  
  let modalMobileStyle:any = {
    top: '0px',
    height: '100%',
    margin: '0px',
    padding: '0px',
    maxWidth: '100%'
  }
  let modalPcStyle:any = {
    height: 'calc(100% - 100px)',
    minHeight: '400px',
    maxHeight: 'calc(100% - 200px)'
  }
  modalMobileStyle = isMobile ? modalMobileStyle : modalPcStyle; 
  Object.assign(modalMobileStyle, style);
  
  const contentDom = useMemo(() => {
    return (
      <ContentComponent
      {...contentComponentProps}
      {...omit(rest, ['visible', 'title', 'onChange'])}
      onChange={handleOnChange}
    />
    )
  }, [visible]);

  return (
    <>
      {createPortal(
        <div className={`object-modal ${!visible && 'hidden'}`} onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <Modal
            style={{
              ...modalMobileStyle
            }}
            title={title}
            width={width || 800}
            {...restModalProps}
            // getContainer={false}
            destroyOnClose={true}
            visible={visible}
            onCancel={(e) => {
              setVisible(false);
              modalProps?.onCancel?.(e);
            }}
            onOk={async (e) => {
              if (!onFinish) {
                setVisible(false);
                modalProps?.onOk?.(e);
                return;
              }
              const success = await onFinish(selectedRowKeys, selectedRows);
              if (success !== false) {
                setVisible(false);
                modalProps?.onOk?.(e);
              }
            }}
            maskClosable={false}
          >
            {contentDom}
          </Modal>
        </div>,
        renderDom || document.body,
      )}
      {trigger &&
        React.cloneElement(trigger, {
          ...trigger.props,
          onClick: (e: any) => {
            setVisible(!visible);
            trigger.props?.onClick?.(e);
          },
        })}
    </>
  )
}
