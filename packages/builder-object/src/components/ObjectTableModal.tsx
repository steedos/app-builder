/*
该组件是一个模式弹窗组件包裹了一个ObjectExpandTable组件.
除了show,onClose,onChange这三个参数外,其它的参数直接透传给了ObjectExpandTable
 * @Author: Kent.Wood 
 * @Date: 2021-03-25 22:38:48 
 * @Last Modified by: Kent.Wood
 * @Last Modified time: 2021-03-25 22:39:59
 */
import React, { useState, useEffect, useContext, useMemo } from "react"
import { Modal, ConfigProvider } from "antd"
import { ObjectTable, ObjectTableProps } from ".."
import type { ModalProps } from 'antd';
import { createPortal } from 'react-dom';
import { omit } from "lodash"

export type ModalCommonProps = {
  trigger?: JSX.Element,
  onFinish?: (value: any) => Promise<boolean | void>;
  visible?: ModalProps['visible'];
  onVisibleChange?: (visible: boolean) => void;
  modalProps?: Omit<ModalProps, 'visible'>;
  title?: ModalProps['title'];
  width?: ModalProps['width'];
}

export type ObjectTableModalProps = {
  isDrawer?: boolean
  onChange?: (value: any) => void;
} & ModalCommonProps & ObjectTableProps<any>

export const ObjectTableModal = ({
  isDrawer = false,
  trigger,
  onFinish,
  onVisibleChange,
  modalProps,
  title,
  width,
  onChange,
  ...rest
}: ObjectTableModalProps) => {
  const [selectedRecords, setSelectedRecords] = useState([])
  const [visible, setVisible] = useState<boolean>(!!rest.visible);
  const context = useContext(ConfigProvider.ConfigContext);

  useEffect(() => {
    if (visible && rest.visible) {
      onVisibleChange?.(true);
    }
  }, [visible]);

  const handleOnChange = (records: any) => {
    setSelectedRecords(records);
    onChange && onChange(records);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              const success = await onFinish(selectedRecords);
              if (success !== false) {
                setVisible(false);
                modalProps?.onOk?.(e);
              }
            }}
          >
            <ObjectTable
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
