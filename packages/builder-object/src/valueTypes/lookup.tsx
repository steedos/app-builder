import React, { useContext, useEffect, useState } from "react";
import { useQuery } from 'react-query'

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

const renderFormItem = (_: any, props: any, formMode: any) => {
    const objectContext = useContext(ObjectContext);
    const { fieldSchema = {}, mode, valueType, fieldProps, ...rest } = props;
    const { reference_to, multiple } = fieldSchema;
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
        let filters = [];
        if (params.keyWords && props.text)
            filters = [['name', 'contains', params.keyWords], 'or', ['_id', '=', props.text]]
        else if (props.text)
            filters = [['_id', '=', props.text]]
        else if (params.keyWords)
            filters = [['name', 'contains', params.keyWords]]
        const fields = ['_id', 'name'];
        const data = await objectContext.requestRecords(reference_to, filters, fields);

        const options = data.value.map((item) => {
            return {
                label: item.name,
                value: item._id
            }
        })

        return options
    }

    const proFieldProps = {
        mode: formMode,
        showSearch: true,
        showArrow: true,
        optionFilterProp: 'label',
        fieldProps,
        tagRender,
        request,
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