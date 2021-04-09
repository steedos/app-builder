import React, { useContext, useEffect, useState } from "react";
import { useQuery } from 'react-query'
import { formatFiltersToODataQuery } from '@steedos/filters';

import { Tag } from 'antd';

import _ from 'lodash';

import { ObjectContext } from "../providers/ObjectContext";

import FieldSelect, {
    proFieldParsingText,
    proFieldParsingValueEnumToArray,
} from '@ant-design/pro-field/es/components/Select';

// 相关表类型字段
// 通过下拉框显示相关表中的数据，可以搜索
// 参数 props.reference_to:

const render = (text: any, props: any) => {
    const objectContext = useContext(ObjectContext);
    const { fieldSchema = {}, valueType, fieldProps, ...rest } = props;
    const { reference_to, multiple } = fieldSchema;
    const value = fieldProps.value;
    const [tags, setTags] = useState([]);
    const hrefPrefix = `/app/-/${reference_to}/view/`

    const filter = value ? [['_id', '=', value]] : [];
    const fields = ['_id', 'name'];

    const recordsQuery = useQuery<any>([reference_to, filter, fields], async () => {
        const records = await objectContext.requestRecords(reference_to, filter, fields);
        if (records && records.value && records.value.length > 0) {
            let recordTags = records.value.map((recordItem: any)=>{return {value: recordItem._id, label: recordItem.name }});
            setTags(recordTags);
        }
    },
        {
            enabled: !!value
        }
    );

    if (!recordsQuery.isSuccess) return (<div>Loading record ...</div>)
    return (tags.map((tagItem, index)=>{return (
        <React.Fragment key={tagItem.value}>
            {index > 0 && ', '}
            <a href={`${hrefPrefix}${tagItem.value}`}>{tagItem.label}</a>
        </React.Fragment>
    )}))
}

const renderFormItem = (text: any, props: any, formMode: any) => {
    const objectContext = useContext(ObjectContext);
    const { fieldSchema = {}, mode, valueType, fieldProps, ...rest } = props;
    const { reference_to, reference_sort,reference_limit, multiple, filters: fieldFilters = [] } = fieldSchema;
    const [params, setParams] = useState({open: false,openTag: null});
    if (multiple)
        fieldProps.mode = 'multiple';

    const tagRender = (props) => {
        const { label, value, closable, onClose } = props;
        const href = `/app/-/${reference_to}/view/${value}`
        return (
            <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {formMode === 'read' && (<a href={href}>{label}</a>)}
                {formMode != 'read' && (<span>{label}</span>)}
            </Tag>
        );
    }

    // 注意，request 里面的代码不会抛异常，包括编译错误。
    const request = async (params: any, props: any) => {
        // console.log("===request===params, props==", params, props);
        // console.log("===request===reference_to==", reference_to);
        let filters: any = [], textFilters: any = [], keyFilters: any = [];
        if (props.text)
            textFilters = ['_id', '=', props.text]
        if (params.keyWords)
            keyFilters = ['name', 'contains', params.keyWords]
        if(fieldFilters.length){
            if(keyFilters.length){
                if(_.isArray(fieldFilters)){
                    keyFilters = [fieldFilters, keyFilters]
                }
                else{
                    const odataKeyFilters = formatFiltersToODataQuery(keyFilters);
                    keyFilters = `(${fieldFilters}) and (${odataKeyFilters})`;
                }
            }
            else{
                keyFilters = fieldFilters;
            }
        }
        if(textFilters.length && keyFilters.length){
            if(_.isArray(keyFilters)){
                filters = [textFilters, 'or', keyFilters]
            }
            else{
                const odataTextFilters = formatFiltersToODataQuery(textFilters);
                filters = `(${odataTextFilters}) or (${keyFilters})`;
            }
        }
        else if(textFilters.length){
            filters = textFilters;
        }
        else if(keyFilters.length){
            filters = keyFilters;
        }
        const fields = ['_id', 'name'];
        // console.log("===filters===", filters);
        let order = _.map(reference_sort,(value,key)=>{return `${key}${value==1? '' :' desc' }`}).join(",")
        const option:any = {
            'sort': order,
            'pageSize': reference_limit,

        }
        const data = await objectContext.requestRecords(reference_to, filters, fields, option);

        const options = data.value.map((item) => {
            return {
                label: item.name,
                value: item._id
            }
        })

        return options
    }

    const onDropdownVisibleChange = (open: boolean)=>{
        if(open){
            setParams({open, openTag: new Date()});
        }
    }

    const proFieldProps = {
        mode: formMode,
        showSearch: true,
        showArrow: true,
        optionFilterProp: 'label',
        fieldProps,
        tagRender,
        request,
        params,
        onDropdownVisibleChange,
        ...rest
    }

    return (
        <FieldSelect {...proFieldProps} />
    )
}


export const lookup = {
    render: (text: any, props: any) => {
        return render(text, props)
    },
    renderFormItem: (text: any, props: any) => {
        return renderFormItem(text, props, 'edit')
    }
}