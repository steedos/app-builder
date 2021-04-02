import React from 'react';
import {Input} from 'antd';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { STEEDOS_ROOT_URL } = process.env

/*
 * 对象字段类型组件
 * 定义对象的key,value键值对结构，可在界面编辑该对象结构的数据并保存到数据库中
 * 组件支持属性
 * - id : string
 * - name: string
 * 
 * 保存到spa_lfa1表记录中对应为以下效果
 *    "id": "pcsscrbDSMXDBQjbA"
 *    "imgs__c": "iHXH3SrYP5ZcarQbX"
 * 
 * 对应的组件属性具体为
 * - name: "imgs__c"
 * - url: string
*/

export const image = {
    render: (text : any, props : any) => {
        console.log('图片进入readonly状态')
        let url = STEEDOS_ROOT_URL+'/api/files/images/'+text ;
        url= url ? url : 'https://avatars.githubusercontent.com/u/3104826?s=200&v=4';
        console.log(url)
        return (<img title="img" style={{ height: "50px"}} src={url}/>)
    },
    renderFormItem: (_ : any, props : any) => {
      console.log('renderFormItem编辑状态', props)
        // return (<Input>image edit</div>)
        // return (<Input placeholder="请输入哈哈哈" {...props}/>)
        // return (<imageupdate>defaultInsertRecord</imageupdate>)
        // const props = {
        //   beforeUpload: file => {
        //     if (file.type !== 'image/png') {
        //       message.error(`${file.name} is not a png file`);
        //     }
        //     return file.type === 'image/png' ? true : Upload.LIST_IGNORE;
        //   },
        //   onChange: info => {
        //     console.log(info.fileList);
        //   },
        // };

        
        return (
          <Upload {...props} type="file" accept="image/png, image/jpeg, image/gif" action="" maxCount="1" > 
            <Button icon={<UploadOutlined />} title="上传图片">Upload png only</Button>
          </Upload>
        );
    }
}
      //  export const isImageUrl = (file: UploadFile): boolean => {
      //   if (file.type) {
      //     return isImageFileType(file.type);
      //   }
      //   const url: string = (file.thumbUrl || file.url) as string;
      //   const extension = extname(url);
      //   if (
      //     /^data:image\//.test(url) ||
      //     /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(extension)
      //   ) {
      //     return true;
      //   }
      //   if (/^data:/.test(url)) {
      //     // other file types of base64
      //     return false;
      //   }
      //   if (extension) {
      //     // other file types which have extension
      //     return false;
      //   }
      //   return true;
      // };