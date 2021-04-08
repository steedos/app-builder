import React from 'react';
import {Input} from 'antd';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Image } from "antd";
const { STEEDOS_ROOT_URL,STEEDOS_USER_ID,STEEDOS_TENANT_ID ,STEEDOS_AUTH_TOKEN } = process.env
import FieldImage from '@ant-design/pro-field/es/components/Image';

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

const renderFormItem = (text: any, props: any, formMode) => {
    const { fieldProps={} } = props;
    let { onChange } = fieldProps;

    if (formMode === 'read') {
        let url = STEEDOS_ROOT_URL + '/api/files/images/' + text;
        const proFieldProps = {
            mode: formMode
        }
        return (<Image alt="图片" width={32} src={url} />)
        // return (<FieldImage {...proFieldProps} />)
    }
    if (formMode === 'edit') {
        // console.log('进入eidt',props)
        props.name = "file" //TODO Upload组件中会自动将参数 name 的 value 作为一个参数传递给后端
        const propsOther = {
            // http://127.0.0.1:5080/s3/images
            action: STEEDOS_ROOT_URL+'/s3/images',
            type: 'file',
            method: 'post',
            accept: 'image/png, image/jpeg, image/jpg, image/gif',
            maxCount: '1',
            data:{
                record_id: "KFon27jRaw5N7Q8fJ",//TODO: 暂时获取不到 此值，所以写死了。 "cv9eHrkq9HdNZ4YYC"
                object_name: props.fieldSchema.object,  // props.fieldSchema.object
                space: STEEDOS_TENANT_ID,
                owner: STEEDOS_USER_ID,
                owner_name: ""
            },
            headers:{
                'X-User-Id':STEEDOS_USER_ID,
                'X-Auth-Token':STEEDOS_AUTH_TOKEN
            },
            onChange: (options: any)=>{
                const { file } = options;
                if(file.status==="done"){
                    onChange(file.response._id)
                }
            }
        }
        return (
            <Upload {...props} {...propsOther} >
                <Button icon={<UploadOutlined />} title="上传图片">Upload png only</Button>
            </Upload>
        );
  }
  
}

export const image = {
    render: (text : any, props : any) => {
        // console.log('图片1进入readonly状态',props)
        return renderFormItem(text,props,'read')
    },

    renderFormItem: (text: any, props : any) => {
        //console.log('图片1进入edit状态',props)
        return renderFormItem(text,props,'edit')
    }
}