import React, { useState, useEffect, useContext, useMemo, useRef } from "react"
import { useResizeObserver } from "../utils/use-resize-observer";
import { Modal, ConfigProvider } from "antd"
import { 
  ObjectTable, ObjectTableProps, 
  ObjectExpandTable, ObjectExpandTableProps, 
  ObjectTree, ObjectTreeProps,
  ObjectListView, ObjectListViewProps, 
  Organizations, OrganizationsProps,
  SpaceUsers, SpaceUsersProps,
} from ".."
import { createPortal } from 'react-dom';
import { omit, isArray } from "lodash"
import type { ModalProps } from 'antd';
import "./ObjectModal.less"

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
  ...rest
}: ObjectModalProps) => {
  const defaultValue = (value && value.length && (isArray(value) ? value : [value])) || []
  const [selectedRowKeys, setSelectedRowKeys] = useState(defaultValue)
  const [selectedRows, setSelectedRows] = useState([])
  const [visible, setVisible] = useState<boolean>(!!rest.visible);
  const context = useContext(ConfigProvider.ConfigContext);

  const resizeSubject = useRef()
  const contentRect: any = useResizeObserver(resizeSubject, (current: any)=>{
    return current
  }, visible);
  const contentRectHeight = contentRect.height;
  const contentRectWidth = contentRect.width * 0.8;
  const scroll = useMemo(() => {
    //TODO: 481后期需要换掉，换成灵活的变量值
    let scrollHeight = contentRectHeight - 481;
    if(selectedRowKeys && selectedRowKeys.length){
      scrollHeight -= 64;
    }
    //TODO: （ contentRectWidth - 340 - 12*3 ）后期需要换掉，换成灵活的变量值
    let scrollWidth = contentRectWidth - 340 - 12*3;
    // return {x:scrollWidth, y: scrollHeight }
    return {y: scrollHeight }
  }, [contentRectHeight, selectedRowKeys]);
  useEffect(() => {
    if (visible && rest.visible) {
      onVisibleChange?.(true);
    }
  }, [visible]);

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
  if([ObjectTable, ObjectExpandTable, ObjectListView, SpaceUsers].indexOf(ContentComponent) > -1){
    // 底层使用的是ObjectTable时multiple及value属性实现逻辑
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
  else if([ObjectTree, Organizations].indexOf(ContentComponent) > -1){
    // 底层使用的是ObjectTree时multiple及value属性实现逻辑
    Object.assign(contentComponentProps, {
      multiple,
      defaultSelectedKeys: isArray(value) ? value : [value]
    });
  }
  return (
    <>
      {createPortal(
        <div className="object-modal" ref={resizeSubject} onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <Modal
            title={title}
            width={width || 800}
            {...modalProps}
            getContainer={false}
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
            <ContentComponent
              {...contentComponentProps}
              {...omit(rest, ['visible', 'title', 'onChange'])}
              scroll={scroll}
              onChange={handleOnChange}
            />
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
