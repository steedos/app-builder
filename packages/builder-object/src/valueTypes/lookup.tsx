import React, { useContext, useEffect, useState } from "react";

import ProField from "@ant-design/pro-field";
import _ from 'lodash';

import { ObjectContext } from "../providers/ObjectContext";
import { ObjectFieldLookup } from '../components/ObjectFieldLookup'

// 相关表类型字段
// 通过下拉框显示相关表中的数据，可以搜索
// 参数 props.reference_to:

export const lookup = {
    render: (text: any, props: any) => {
        const link = "lookupto:" + text;
        return (<a href={link}>{text}</a>)
    },
    renderFormItem: (_: any, props: any) => {
        console.log(props)
        
        const objectContext = useContext(ObjectContext);
        const { fieldSchema={}, mode, valueType, fieldProps, ...rest } = props;
        const { reference_to, multiple } = fieldSchema;

        // 注意，request 里面的代码不会抛异常，包括编译错误。
        const request = async (params, props) => {
            console.log(params)
            let filters = [];
            if (params.keyWords && props.text)
                filters = [['name', 'contains', params.keyWords], 'or', ['_id', '=', props.text]]
            else if ( props.text)
                filters = [['_id', '=', props.text]]
            else if (params.keyWords)
                filters = [['name', 'contains', params.keyWords]]
            const fields = ['_id', 'name'];
            const data = await objectContext.requestRecords(reference_to, filters, fields);
            console.log(data)

            const options = data.value.map( (item)=> {
                return {
                    label: item.name,
                    value: item._id
                }
            })
            
            console.log(options)
            return options
        }

        if (multiple)
            fieldProps.mode =  'multiple';
        const proFieldProps = {
            mode: 'edit',
            valueType: 'select',
            showSearch: true,
            showArrow: true,
            optionFilterProp: 'label',
            fieldProps,
            request,
            ...rest
        }

        return (
            <ProField {...proFieldProps} />
        )
    }
}