import React, { useContext, useEffect, useState } from "react";
import { useQuery } from 'react-query'
import { formatFiltersToODataQuery } from '@steedos/filters';
import { Tag } from 'antd';
import _ from 'lodash';
import { useStore } from '@steedos/builder-store';
import { ObjectContext } from "../providers/ObjectContext";
import { observer } from "mobx-react-lite";
import { Form } from '@steedos/builder-form';
import FieldSelect, {
    proFieldParsingText,
    proFieldParsingValueEnumToArray,
} from '@ant-design/pro-field/es/components/Select';

// 相关表类型字段
// 通过下拉框显示相关表中的数据，可以搜索
// 参数 props.reference_to:

const LookupReadonly = observer((props:any) => {

    const store = useStore();
    const { fieldSchema = {}, valueType, fieldProps, ...rest } = props;
    let { reference_to, multiple, reference_to_field = "_id" } = fieldSchema;
    const value = fieldProps.value;
    let tags:any[] = [];
    const hrefPrefix = `/app/-/${reference_to}/view/`

    if(value){
        const filter = value ? [[reference_to_field, '=', value]] : [];
        const fields = [reference_to_field, 'name'];
    
        const object = store.objectStore.getObject(reference_to);
        if (object.isLoading) return (<div>Loading object ...</div>);
        const recordList: any = object.getRecordList(filter, fields);
        if (recordList.isLoading) return (<div>Loading recordList ...</div>);
        const recordListData = recordList.data;
        if (recordListData && recordListData.value && recordListData.value.length > 0) {
            tags = recordListData.value.map((recordItem: any)=>{return {value: recordItem[reference_to_field], label: recordItem.name }});
        }
    }
    return (<React.Fragment>{tags.map((tagItem, index)=>{return (
        <React.Fragment key={tagItem.value}>
            {index > 0 && ', '}
            <a href={`${hrefPrefix}${tagItem.value}`}>{tagItem.label}</a>
        </React.Fragment>
    )})}</React.Fragment>)
});

const render = (text: any, props: any) => {
    return (<LookupReadonly {...props}></LookupReadonly>)
};

const renderFormItem = (text: any, props: any, formMode: any) => {
    const objectContext = useContext(ObjectContext);
    const { fieldSchema = {}, mode, valueType, fieldProps, ...rest } = props;
    const { reference_to, reference_sort,reference_limit, multiple, reference_to_field = "_id", filters: fieldFilters = [] } = fieldSchema;
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
            textFilters = [reference_to_field, '=', props.text]
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
        const fields = [reference_to_field, 'name'];
        // console.log("===filters===", filters);
        let option: any = {};
        if(reference_sort){
            option.sort = _.map(reference_sort,(value,key)=>{return `${key}${value==1? '' :' desc' }`}).join(",")
        }
        if(reference_limit){
            option.pageSize = reference_limit
        }
        const data = await objectContext.requestRecords(reference_to, filters, fields, option);

        const options = data.value.map((item) => {
            return {
                label: item.name,
                value: item[reference_to_field]
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