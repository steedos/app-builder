/*
这是一个带有输入框的组件,点了能够弹出ObjectTablePicker模式弹窗来
它定义了value,onChange这两个和ant design的formItem兼容的属性
 * @Author: Kent.Wood 
 * @Date: 2021-03-25 22:40:09 
 * @Last Modified by: Kent.Wood
 * @Last Modified time: 2021-03-26 12:22:50
 */

import { Button, Input, Select } from "antd"
import _ from "lodash"
import React, { useState } from "react"
import { PlusOutlined } from "@ant-design/icons"
import { ObjectTablePicker, ObjectTablePickerProps } from ".."
const { Option } = Select

export type SelectUserInputProps = {
  value: any[]
  inputLabelField: string | ((any) => string) //选出来的数据,如何渲染成输入框里的标签文本
  onChange: ([any]) => void
} & ObjectTablePickerProps

export const SelectUserInput = (props: SelectUserInputProps) => {
  const { value, inputLabelField, onChange, ...rest } = props
  const [selectedRecords, setSelectedRecords] = useState<any[]>(value)
  const [openPopup, setOpenPopup] = useState(false)

  return (
    <>
      <Input.Group compact style={{ display: "flex" }}>
        <Button
          style={{
            display: "flex",
            alignItems: "center",
          }}
          icon={<PlusOutlined />}
          onClick={() => setOpenPopup(true)}
        ></Button>
        <Select mode="tags" style={{ flex: 1 }} value={selectedRecords}>
          {selectedRecords &&
            selectedRecords.map((item, i) => (
              <Option key={i} value={item}>
                {inputLabelField == undefined
                  ? item
                  : typeof inputLabelField == "string"
                  ? item[inputLabelField]
                  : typeof inputLabelField == "function"
                  ? inputLabelField(item)
                  : item}
              </Option>
            ))}
        </Select>
      </Input.Group>

      <ObjectTablePicker
        show={openPopup}
        {...rest}
        onClose={() => setOpenPopup(false)}
        onChange={(emails) => {
          setSelectedRecords([...selectedRecords, ...emails])
        }}
      ></ObjectTablePicker>
    </>
  )
}
