import React from 'react';

// 图片类型字段
// 编辑时显示图片上传按钮，上传的瞬间即调用服务端接口上传图片，并获取文件ID，
// value 中保存该 文件ID
// 显示界面根据此 文件ID，从服务端调用接口显示一张图片

export const image = {
  render: (text: any, props: any) => {
    return (<div>image display</div>)
  },
  renderFormItem: (_: any, props: any) => {
    return (<div>image edit</div>)
  }
}