import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Upload, Button, message } from 'antd';
import { Image } from "antd";
import { Settings , API} from '@steedos/builder-store';
import FieldImage from '@ant-design/pro-field/es/components/Image';
import { observer } from "mobx-react-lite";

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

export const ImageField = observer((props: any) => {
    const { fieldProps = {} ,mode ,text, fileType} = props;
    let { onChange } = fieldProps;

    if (mode === 'read') {
        let url = Settings.rootUrl + '/api/files/'+fileType+'/' + text;
        return (<Image alt="图片" width={32} src={url} />)
        // return (<FieldImage {...proFieldProps} />)
    }
    if (mode === 'edit') {
        // props.name = "file" //TODO Upload组件中会自动将参数 name 的 value 作为一个参数传递给后端
        const proProps = Object.assign({}, props, {name:"file"});
        const [fileList, setFileList] = useState([]);
        const onPreview = async file => {
            let src = file.url;
            if (!src) {
                src = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file.originFileObj);
                    reader.onload = () => resolve(reader.result);
                });
            }
            const image = new window.Image();
            image.src = src;
            const imgWindow = window.open(src);
            imgWindow.document.write(image.outerHTML);
        };
        const propsOther = {
            // http://127.0.0.1:5080/s3/images
            action: Settings.rootUrl + '/s3/'+fileType,
            listType: 'picture-card',
            fileList,
            onPreview,
            type: 'file',
            method: 'post',
            accept: 'image/png, image/jpeg, image/jpg, image/gif',
            // maxCount: '1',
            data: {
                space: Settings.tenantId,
                owner: Settings.userId
            },
            headers: {
                'X-User-Id': Settings.userId,
                'X-Auth-Token': Settings.authToken
            },
            onChange: (options: any) => {
                const { file, fileList: newFileList } = options;
                setFileList(newFileList);
                if (file.status === "done") {
                    onChange(file.response._id)
                }
            }
        }
        return (
            <Upload {...proProps} {...propsOther}>
                {fileList.length < 1 && '+ Upload'}
            </Upload>
        );
    }
});

export const image = {
    render: (text: any, props: any) => {
        return (<ImageField {...props} mode="read" fileType="images"></ImageField>)
    },

    renderFormItem: (text: any, props: any) => {
        return (<ImageField {...props} mode="edit" fileType="images"></ImageField>)
    }
}