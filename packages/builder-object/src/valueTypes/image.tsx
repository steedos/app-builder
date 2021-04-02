import React from 'react';
import {Input} from 'antd';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Image } from "antd";
const { STEEDOS_ROOT_URL } = process.env

/*
 * 对象字段类型组件
 * 定义对象的key,value键值对结构，可在界面编辑该对象结构的数据并保存到数据库中
 * 组件支持属性
 * - id : string
 * - name: string
 * 比如华炎魔方space_users对象中有一个avatar字段
 *  avatar:
 *    type: "avatar"
 *    label: "头像"
 *    name: "avatra"
 * 对应的组件属性具体为
 * - type: "image"
 * - multiple: true
 * 
 * 保存到spa_lfa1表记录中对应为以下效果
 *    "imgs__c": "iHXH3SrYP5ZcarQbX"
*/

export const image = {
    render: (text : any, props : any) => {
        // console.log('图片进入readonly状态',props)
        let url = STEEDOS_ROOT_URL+'/api/files/images/'+text ;
        url= url ? url : 'https://avatars.githubusercontent.com/u/3104826?s=200&v=4';
        return (<Image alt="图片" width={50} src={url} />)
    },
    renderFormItem: (_ : any, props : any) => {
        // console.log('图片进入edit状态',props)
        return (
          <Upload {...props} type="file" method="post" accept="image/png, image/jpeg, image/gif" action="http://192.168.0.98:5066/s3" maxCount="1"> 
            <Button icon={<UploadOutlined />} title="上传图片">Upload png only</Button>
          </Upload>
        );
    }
}