import React from 'react';
import { ObjectFieldLookup } from '../components/ObjectFieldLookup'

// 相关表类型字段
// 通过下拉框显示相关表中的数据，可以搜索
// 参数

export const lookup = {
    render: (text: any, props: any) => {
        const link = "lookupto:" + text;
        return (<a href={link}>{text}</a>)
    },
    renderFormItem: (_: any, props: any) => {
        // console.log("props====lookup", props);
        return (
            <ObjectFieldLookup  referenceTo={props.fieldProps.reference_to} {...props} />
            // <a href="www.baidu.com">2342423</a>
        )
    }
}