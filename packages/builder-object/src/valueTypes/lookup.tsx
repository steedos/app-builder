import React, { useState } from "react";
import { formatFiltersToODataQuery } from '@steedos/filters';
import { Tag , Select, Spin } from 'antd';
import _, { isObject, result, values } from 'lodash';
import { Objects, API } from '@steedos/builder-store';
import { observer } from "mobx-react-lite";
import FieldSelect from '@ant-design/pro-field/es/components/Select';
import { Link } from "react-router-dom";
import { getObjectRecordUrl } from "../utils";
import { SteedosIcon } from '@steedos/builder-lightning';
import "./lookup.less"

const { Option } = Select;
// 相关表类型字段
// 通过下拉框显示相关表中的数据，可以搜索
// 参数 props.reference_to:
export const LookupField = observer((props:any) => {
    const [params, setParams] = useState({open: false,openTag: null});
    const { valueType, mode, fieldProps, request, ...rest } = props;
    const { field_schema: fieldSchema = {},depend_field_values: dependFieldValues={},onChange } = fieldProps;
    const { reference_to, reference_sort,reference_limit, showIcon, multiple, reference_to_field = "_id", filters: fieldFilters = [],filtersFunction } = fieldSchema;
    let value= fieldProps.value || props.text;//ProTable那边fieldProps.value没有值，只能用text
    let valueOriginal = value;
    let tags:any[] = [];
    let referenceTos = _.isFunction(reference_to) ? reference_to() : reference_to;
    let defaultReferenceTo:any;
    if(_.isArray(referenceTos)){
        if(value && value.o){
            defaultReferenceTo = value.o;
        }else{
            defaultReferenceTo = referenceTos[0];
        }
    }
    let [referenceTo, setReferenceTo] = useState(_.isArray(referenceTos) ? defaultReferenceTo : referenceTos);
    let [selectItemLabel, setSelectItemLabel] = useState('');
    // optionsFunction优先options
    let options = fieldSchema.optionsFunction ? fieldSchema.optionsFunction : fieldSchema.options ;
    // if(_.isArray(referenceTos) && value ){
        if(_.isObject(value) && !_.isArray(value)){
            value=value['ids'];
        }
    //}
    let referenceToObject,referenceToObjectSchema,referenceToLableField, referenceToObjectIcon;
    if(referenceTo){
        referenceToObject = Objects.getObject(referenceTo);
        if (referenceToObject.isLoading) return (<div><Spin/></div>);
        referenceToObjectSchema = referenceToObject.schema;
        referenceToLableField = referenceToObjectSchema["NAME_FIELD_KEY"] ? referenceToObjectSchema["NAME_FIELD_KEY"] : "name";
        if(referenceToObjectSchema.icon){
            referenceToObjectIcon = referenceToObjectSchema.icon;
        }
    }
    let selectItem=[];
    let recordListData: any;
    let filter:any;
    let fields:any;
    if(referenceToObject && value){
        filter = [[reference_to_field, '=', value]];
        fields = [reference_to_field, referenceToLableField, "_id"];
    }
    if(mode==='read'){
        if(value){
            if (referenceTo) {
                const recordList = referenceToObject.getRecordList(filter, fields);
                if (recordList.isLoading) return (<div><Spin/></div>);
                recordListData = recordList.data;
                if (recordListData && recordListData.value && recordListData.value.length > 0) {
                    let tagsValueField = reference_to_field;
                    if(reference_to_field && reference_to_field !== "_id"){
                        // 选人字段只读时链接应该显示的是space_users的_id字段值，而不是user字段值
                        tagsValueField = "_id"
                    }
                    selectItem = recordListData.value.map((recordItem: any) => { 
                        return { value: recordItem[tagsValueField], label: recordItem[referenceToLableField] } 
                    });
                }
                tags = selectItem;
            }else{
                // TODO:options({}) 里的对象后期需要存放value进入
                options = _.isFunction(options) ? options(dependFieldValues) : options;
                tags = _.filter(options,(optionItem: any)=>{
                    return multiple ? value.indexOf(optionItem.value) > -1 : optionItem.value === value;
                })
            }
        }
        return (<React.Fragment>{tags.map((tagItem, index)=>{return (
            <React.Fragment key={tagItem.value}>
                {index > 0 && ', '}
                { referenceTo ? (<Link to={getObjectRecordUrl(referenceTo, tagItem.value)} className="text-blue-600 hover:text-blue-500 hover:underline">{tagItem.label}</Link>) : (tagItem.label) }
            </React.Fragment>
        )})}</React.Fragment>)
    }else{
        if (multiple)
            fieldProps.mode = 'multiple';

        let dependOnValues: any = dependFieldValues;
        let request: any;
        let labelInValue=false;
        let requestFun= async (params: any, props: any) => {
            // 注意，request 里面的代码不会抛异常，包括编译错误。
            // console.log("===request===params, props==", params, props);
            // console.log("===request===reference_to==", reference_to);

            if(_.isFunction(options)) {
                dependOnValues.__keyWords = params.keyWords;
                dependOnValues.__referenceTo = referenceTo;
                const results = await options(dependOnValues);
                return results;
            }
            else{
                let filters: any = [], textFilters: any = [], keyFilters: any = [];
                if (value){
                    // const textValue= _.isArray(referenceTos) ? value.ids: value;
                    textFilters = [reference_to_field, '=', value];
                }
                if (params.keyWords){
                    keyFilters = [referenceToLableField, 'contains', params.keyWords];
                }
                let filtersOfField:[] =  filtersFunction ? filtersFunction(fieldFilters) : fieldFilters;
                if (filtersOfField.length) {
                    if (keyFilters.length) {
                        if (_.isArray(filtersOfField)) {
                            keyFilters = [filtersOfField, keyFilters]
                        }
                        else {
                            const odataKeyFilters = formatFiltersToODataQuery(keyFilters);
                            keyFilters = `(${filtersOfField}) and (${odataKeyFilters})`;
                        }
                    }
                    else {
                        keyFilters = filtersOfField;
                    }
                }
                if (textFilters.length && keyFilters.length) {
                    if (_.isArray(keyFilters)) {
                        filters = [textFilters, 'or', keyFilters]
                    }
                    else {
                        const odataTextFilters = formatFiltersToODataQuery(textFilters);
                        filters = `(${odataTextFilters}) or (${keyFilters})`;
                    }
                }
                else if (textFilters.length && !open) {
                    filters = textFilters;
                }
                else if (keyFilters.length) {
                    filters = keyFilters;
                }
                let fields = [reference_to_field, referenceToLableField];
                // console.log("===filters===", filters);
                let option: any = {};
                if (reference_sort) {
                    option.sort = _.map(reference_sort, (value, key) => { 
                        if(fields.indexOf(key)<0){ fields.push(key) };
                        return `${key}${value == 1 ? '' : ' desc'}` 
                    }).join(",")
                }
                if (_.isArray(referenceTos)) {
                    option.referenceTos = referenceTos;
                }
                if (reference_limit) {
                    option.pageSize = reference_limit
                }
                let data = await API.requestRecords(referenceTo, filters, fields, option);

                const results = data.value.map((item: any) => {
                    return {
                        label: item[referenceToLableField],
                        value: item[reference_to_field]
                    }
                })
                return results;
            }
        }

        if (referenceTo){ // 含有reference_to
            if (!options) {
                request = requestFun;
            }
            else if (options) {
                if (_.isArray(options)) {
                    fieldProps.options = options;
                } else if (_.isFunction(options)) {
                    request = requestFun;
                }
            }
        }else{ // 最后一种情况 没有referenceTo 只有options 或 optionsFunction 
            if (_.isFunction(options)) {
                request = async (params: any, props: any) => {
                    dependFieldValues.__keyWords = params.keyWords;
                    const results = await options(dependFieldValues);
                    return results;
                };
            } else {
                fieldProps.options = options;
            }
        }
        const onDropdownVisibleChange = (open: boolean) => {
            if (open) {
                setParams({ open, openTag: new Date() });
            }
        }

        let newFieldProps:any=fieldProps;
        if(_.isArray(referenceTos)){
            labelInValue=true;
            const recordList = referenceToObject.getRecordList(filter, fields);
            // 根据ID获取请求 获取对应的 label。 不需要下面这行isloading判断
            // if (recordList.isLoading) return (<div><Spin/></div>);
            recordListData = recordList.data;
            if (recordListData && recordListData.value && recordListData.value.length > 0) {
                selectItemLabel = recordListData.value.map((recordItem: any)=>{
                    return recordItem[referenceToLableField];
                }).join(",");
            }
            newFieldProps = Object.assign({}, fieldProps, {
                value: {value: fieldProps.value,label: selectItemLabel},
                onChange:(values: any, option: any)=>{
                    setSelectItemLabel(values.label)
                    onChange({o: referenceTo, ids: [values.value]})
                }
            })
        }
        let optionItemRender;
        if(showIcon && referenceToObjectIcon){
            optionItemRender = (item) => {
                return (
                    <React.Fragment>
                        <span role="img" aria-label="smile" className="anticon anticon-smile"><SteedosIcon name={referenceToObjectIcon} size="x-small"/></span>
                        <span>{item.label}</span>
                    </React.Fragment>
                    )
            }
        }
        const proFieldProps = {
            mode: mode,
            showSearch: true,
            showArrow: true,
            optionFilterProp: 'label',
            fieldProps: newFieldProps,
            request,
            labelInValue,
            params,
            onDropdownVisibleChange,
            optionItemRender,
            ...rest
        }
        const SelectProFieldProps = {
            mode: mode,
            showSearch: true,
            showArrow: true,
            optionFilterProp: 'label',
            onChange: (value: any) => {
                setReferenceTo(value)
            },
            defaultValue:referenceTo
        }
        const needReferenceToSelect = _.isArray(referenceTos) && !_.isArray(options)
        let referenceToOptions:any = [];
        let isLoadingReferenceTosObject;
        if(needReferenceToSelect){
            _.forEach(referenceTos,(val)=>{
                const referenceToObject = Objects.getObject(val);
                if (!referenceToObject.isLoading){
                    referenceToOptions.push({label:referenceToObject.schema.label,value:val})
                }
            })
            isLoadingReferenceTosObject = referenceToOptions.length !== referenceTos.length;
        }
        if(isLoadingReferenceTosObject) return (<div><Spin/></div>)
        return (
            <React.Fragment>
                {
                    needReferenceToSelect && 
                    (<Select style={{ width: "30%" }}  {...SelectProFieldProps} options={referenceToOptions} ></Select>)
                }
                <FieldSelect {...proFieldProps} style={ _.isArray(referenceTos) ? { width: "70%" } : { width: "100%" }} />

            </React.Fragment>
        )
    }
});

export const lookup = {
    render: (text: any, props: any) => {
        return (<LookupField {...props} mode="read"></LookupField>)
    },
    renderFormItem: (text: any, props: any) => {
        return (<LookupField {...props} mode="edit"></LookupField>)
    }
}