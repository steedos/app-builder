import React, { useState, useEffect } from 'react';
import { Upload, Button,  Spin} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Settings , Objects } from '@steedos/builder-store';
import { observer } from "mobx-react-lite";
import { forEach, isArray } from 'lodash';
import './file.less'

const getFileListItem = (item:any, _fileType)=>{
    return (
        {
            uid: item.value,
            name: item.label,
            response:{
                _id: item.value,
            },
            status:'done',
            url: Settings.rootUrl + '/api/files/'+_fileType+'/' + item.value,
        }
    )
}

export const FileField = observer((props: any) => {
    const [fileList, setFileList] = useState([]);
    const { fieldProps = {} ,mode ,fileType} = props;
    const { field_schema = {} } = fieldProps;
    // TODO: 暂时设置附件为单选，多选的保存暂时有bug。
    const { multiple = false } = field_schema;
    let { onChange } = fieldProps;
    const value= fieldProps.value || props.text;

    // 获取默认值
    let filesObject = Objects.getObject('cfs_files_filerecord');
    let filters = [['_id', '=', value]];
    let fields = ['_id','original'];
    const recordList = filesObject.getRecordList(filters, fields);
    const recordListData = filesObject.getRecordList(filters, fields).data;
    const selectItems = [];
    if(recordListData && recordListData.value && recordListData.value.length > 0){
        forEach(recordListData.value,(item)=>{
            selectItems.push({ value: item._id, label: item.original.name})
        })
    }
    useEffect(() => {
        if(filesObject.isLoading || recordList.isLoading){
            return;
        }
        let defaultFileList = [];
        if(value && value.length){
            if(multiple && isArray(value)){
                if(selectItems && selectItems.length){
                    forEach(selectItems,(item)=>{
                        if(item.value){
                            defaultFileList.push(
                                getFileListItem(item, fileType)
                            )
                        }
                    })
                }
            }else{
                if (selectItems && selectItems.length) {
                    defaultFileList = [getFileListItem(selectItems[0], fileType)]
                }
            }
        }
        setFileList(defaultFileList)
    }, [filesObject.isLoading, recordList.isLoading]);
    if(filesObject.isLoading || recordList.isLoading){
        return (<div><Spin/></div>);
    }
    if (mode === 'read') { 
        const tags = [];
        if(selectItems && selectItems.length){
            forEach(selectItems,(item)=>{
                tags.push({ value: Settings.rootUrl + '/api/files/'+fileType+'/' + item.value + "?download=true", label: item.label})
            })
        }
        return (<React.Fragment>{tags.map((tagItem, index)=>{
            return (
                <a title="附件" href={tagItem.value} className="mr-2" target="_blank">{ tagItem.label }</a>
            )
            })}</React.Fragment>
        )
    }else{
        const proProps = Object.assign({}, props, {name:"file"});
        const propsOther = {
            action: Settings.rootUrl + '/s3/'+fileType,
            multiple,
            fileList,
            type: 'file',
            method: 'post',
            // accept: 'image/png, image/jpeg, image/jpg, image/gif',
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
        const uploadDom = <Button icon={<UploadOutlined />}>上传</Button>
        return (
            <Upload {...proProps} {...propsOther}>
                { multiple  ? uploadDom : fileList.length < 1 && uploadDom}
            </Upload>
        );
    }
});

export const file = {
    render: (text: any, props: any) => {
        return (<FileField {...props} mode="read" fileType="files" />)
    },

    renderFormItem: (text: any, props: any) => {
        return (<FileField {...props} mode="edit" fileType="files" />)
    }
}