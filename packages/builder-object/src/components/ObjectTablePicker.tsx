/*
该组件是一个模式弹窗组件包裹了一个ObjectExpandTable组件.
除了show,onClose,onChange这三个参数外,其它的参数直接透传给了ObjectExpandTable
 * @Author: Kent.Wood 
 * @Date: 2021-03-25 22:38:48 
 * @Last Modified by: Kent.Wood
 * @Last Modified time: 2021-03-25 22:39:59
 */
import React, { useState } from "react"
import { ObjectExpandTableProps } from ".."
import { Modal, TreeSelect, Select, Input, Button } from "antd"
import { ObjectExpandTable } from ".."

export type ObjectTablePickerProps = {
  show?: boolean
  onClose?: () => void
  onChange?: ([any]) => void
} & ObjectExpandTableProps

export const ObjectTablePicker = ({
  show,
  onClose,
  onChange,
  ...rest
}: ObjectTablePickerProps) => {
  const [selectedRecords, setSelectedRecords] = useState([])

  const handleOnChange = (records) => {
    setSelectedRecords(records)
  }
  return (
    <Modal
      width="100%"
      visible={show}
      onCancel={() => onClose && onClose()}
      onOk={() => {
        onChange && onChange(selectedRecords)
        onClose && onClose()
      }}
    >
      <ObjectExpandTable
        onChange={handleOnChange}
        {...rest}
      ></ObjectExpandTable>
    </Modal>
  )
}
