import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Upload, Button, message } from 'antd';
import { Image } from "antd";
import { Settings , API} from '@steedos/builder-store';
import FieldImage from '@ant-design/pro-field/es/components/Image';
import { observer } from "mobx-react-lite";
import { forEach, isArray } from 'lodash';

import "./image.less"

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

const getFileListItem = (_id:any, _fileType)=>{
    return (
        {
            uid: _id,
            response:{
                _id: _id,
            },
            status:'done',
            url: Settings.rootUrl + '/api/files/'+_fileType+'/' + _id,
        }
    )
}

export const ImageField = observer((props: any) => {
    const { fieldProps = {} ,mode ,text, fileType} = props;
    const { field_schema = {} } = fieldProps;
    const { multiple } = field_schema;
    let { onChange } = fieldProps;
    const value= fieldProps.value || props.text;
    let defaultFileList = [];
    if(value && value.length){
        if(multiple){
            forEach(value,(idValue)=>{
                defaultFileList.push(
                    getFileListItem(idValue, fileType)
                )
            })
        }else{
            defaultFileList = [getFileListItem(value, fileType)]
        }
    }
    const [fileList, setFileList] = useState(defaultFileList);

    if (mode === 'read') {
        const tags = [];
        const items = multiple ? value : [value];
        if(items && items.length){
            forEach(items,(itemsValue)=>{
                tags.push(Settings.rootUrl + '/api/files/'+fileType+'/' + itemsValue)
            })
        }
        return (<Image.PreviewGroup>{tags.map((tagItem, index)=>{return (
            <Image alt="图片" height={25} src={tagItem} className="mr-2 image-item" />
        )})}</Image.PreviewGroup>)
    }else{
        // props.name = "file" //TODO Upload组件中会自动将参数 name 的 value 作为一个参数传递给后端
        const proProps = Object.assign({}, props, {name:"file"});
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
                let fileIds:any = [];
                forEach(newFileList,(item)=>{
                    if (item.status === "done") {
                        fileIds.push(item.response._id)
                    }
                })
                if (newFileList.length == fileIds.length) {
                    if(!multiple){
                        fileIds= fileIds.length ? fileIds[0] : '';
                    }
                    onChange(fileIds)
                }
            }
        }
        return (
            <Upload {...proProps} {...propsOther}>
                { multiple  ? '+ Upload' : fileList.length < 1 && '+ Upload'}
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