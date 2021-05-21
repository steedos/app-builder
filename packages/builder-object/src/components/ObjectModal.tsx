import React, { useState, useEffect, useContext, useMemo } from "react"
import { Modal, ConfigProvider } from "antd"
import { ObjectTableProps, ObjectExpandTableProps } from ".."
import { createPortal } from 'react-dom';
import { omit } from "lodash"
import type { ModalProps } from 'antd';
// import { ModalCommonProps } from "../utils"

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
  contentComponent: React.FunctionComponent
} & ObjectTableProps<any> & ObjectExpandTableProps

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
  ...rest
}: ObjectModalProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [visible, setVisible] = useState<boolean>(!!rest.visible);
  const context = useContext(ConfigProvider.ConfigContext);

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

  return (
    <>
      {createPortal(
        <div onClick={(e) => e.stopPropagation()}>
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
          >
            <ContentComponent
              {...omit(rest, ['visible', 'title', 'onChange'])}
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
