import React, { useState , useRef} from "react";
import { formatFiltersToODataQuery } from '@steedos/filters';
import { Select, Spin } from 'antd';
import "antd/es/tree-select/style/index.css";
import { isFunction, isArray, isObject, uniq, filter, map, forEach, isString, isEmpty} from 'lodash';
import { Objects, API, Settings } from '@steedos/builder-store';
import { observer } from "mobx-react-lite";
import FieldSelect from '@ant-design/pro-field/es/components/Select';
import { Link } from "../components/Link";
import { getObjectRecordUrl } from "../utils";
import { SteedosIcon } from '@steedos/builder-lightning';
import "./lookup.less"
import { PlusOutlined } from "@ant-design/icons";
import { ObjectForm, ObjectTable, ObjectExpandTable,ObjectListView, 
    ObjectModal, ObjectTableModal, SpaceUsersModal, OrganizationsModal, ObjectFieldTreeSelect } from "../components";
import { safeRunFunction, BAD_FILTERS } from '../utils';

const { Option } = Select;
// 相关表类型字段
// 通过下拉框显示相关表中的数据，可以搜索
// 参数 props.reference_to:
export const LookupField = observer((props:any) => {
    const [params, setParams] = useState({open: false,openTag: null});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { valueType, mode, fieldProps, request, ...rest } = props;
    const { field_schema: fieldSchema = {},depend_field_values: dependFieldValues={},onChange } = fieldProps;
    const { reference_to, reference_sort,reference_limit, showIcon, multiple, reference_to_field = "_id", filters: fieldFilters = [],filtersFunction, create = true, modal_mode, table_schema } = fieldSchema;
    let value= fieldProps.value || props.text;//ProTable那边fieldProps.value没有值，只能用text
    // 按原来lookup控件的设计，this.template.data._value为原来数据库中返回的选项值，this.template.data.value为当前用户选中的选项
    const optionsFunctionThis = {
        filters: fieldFilters,
        template: {
            data: {
                value: value,
                _value: value
            }
        }
    };
    const objectApiName = props.object_api_name;
    let optionsFunctionValues = Object.assign({}, dependFieldValues, {
        space: Settings.tenantId,
        _object_name: objectApiName
    });
    let tags:any[] = [];
    let referenceTos = isFunction(reference_to) ? reference_to() : reference_to;
    let defaultReferenceTo:any;
    if(isArray(referenceTos)){
        if(value && value.o){
            defaultReferenceTo = value.o;
        }else{
            defaultReferenceTo = referenceTos[0];
        }
    }
    let [referenceTo, setReferenceTo] = useState(isArray(referenceTos) ? defaultReferenceTo : referenceTos);
    // selectedValue 只有在reference_to 是数组的才用到， 值的格式为(value:xx, label:xx)
    const [selectedValue, setSelectedValue] = useState();
    // optionsFunction优先options
    let options = fieldSchema.optionsFunction ? fieldSchema.optionsFunction : fieldSchema.options ;
    // if(isArray(referenceTos) && value ){
        if(isObject(value) && !isArray(value)){
            value=value['ids'];
        }
    //}
    let referenceToObject,referenceToObjectSchema,referenceToLableField, referenceToObjectIcon, referenceParentField;
    if(referenceTo){
        referenceToObject = Objects.getObject(referenceTo);
        if (referenceToObject.isLoading) return (<div><Spin/></div>);
        referenceToObjectSchema = referenceToObject.schema;
        referenceToLableField = referenceToObjectSchema["NAME_FIELD_KEY"] ? referenceToObjectSchema["NAME_FIELD_KEY"] : "name";
        // TODO: organizations.object.yml 文件里后续也要添加一个类似enable_tree属性 parent_field。
        referenceParentField = referenceToObjectSchema.parent_field || "parent"
        if(referenceToObjectSchema.icon){
            referenceToObjectIcon = referenceToObjectSchema.icon;
        }
    }
    let selectItem = [], recordListData: any, referenceTofilters: any, fields: any;
    if(referenceToObject && value){
        referenceTofilters = [[reference_to_field, '=', value]];
        fields = uniq([reference_to_field, referenceToLableField, "_id"]);
    }
    if(mode==='read'){
        if(value){
            if (referenceTo && !options) {
                // tree-select 编辑时会调用只读的缓存，编辑时需要显示字段name，而不是fullname.
                if(referenceTo==='organizations'){
                    fields.push('name')
                }
                const recordList = referenceToObject.getRecordList(referenceTofilters, fields);
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
                options = isFunction(options) ? safeRunFunction(options,[optionsFunctionValues],[], optionsFunctionThis) : options;
                tags = filter(options,(optionItem: any)=>{
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
        if (multiple){
            fieldProps.mode = 'multiple';
        }

        let request: any;
        let labelInValue=false;
        let requestFun= async (params: any, props: any) => {
            // 注意，request 里面的代码不会抛异常，包括编译错误。
            // console.log("===request===params, props==", params, props);
            // console.log("===request===reference_to==", reference_to);

            if(isFunction(options)) {
                optionsFunctionValues._keyWords = params.keyWords;
                optionsFunctionValues._referenceTo = referenceTo;
                const results = await safeRunFunction(options,[optionsFunctionValues],[], optionsFunctionThis);
                return results;
            }
            else{
                let filters: any = [], textFilters: any = [], keyFilters: any = [];
                let fields = [reference_to_field, referenceToLableField];
                // console.log("===filters===", filters);
                let option: any = {};
                if(params.open){
                    if (reference_sort) {
                        option.sort = map(reference_sort, (value, key) => { 
                            if(fields.indexOf(key)<0){ fields.push(key) };
                            return `${key}${value == 1 ? '' : ' desc'}` 
                        }).join(",")
                    }
                    if (reference_limit) {
                        option.pageSize = reference_limit
                    }
                    if (value){
                        textFilters = [reference_to_field, '=', value];
                    }
                    if (params.keyWords){
                        keyFilters = [referenceToLableField, 'contains', params.keyWords];
                    }
                    // let filtersOfField:[] =  filtersFunction ? filtersFunction(fieldFilters) : fieldFilters;
                    let filtersOfField:[] =  filtersFunction ? safeRunFunction(filtersFunction,[fieldFilters],BAD_FILTERS) : fieldFilters;
                    console.log('aaa=>',filtersOfField)
                    if (filtersOfField.length) {
                        if (keyFilters.length) {
                            if (isArray(filtersOfField)) {
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
                        if (isArray(keyFilters)) {
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
                }else{
                    filters = referenceTofilters;
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
                if (isArray(options)) {
                    fieldProps.options = options;
                } else if (isFunction(options)) {
                    request = requestFun;
                }
            }
        }else{ // 最后一种情况 没有referenceTo 只有options 或 optionsFunction 
            if (isFunction(options)) {
                request = async (params: any, props: any) => {
                    optionsFunctionValues._keyWords = params.keyWords;
                    const results = await safeRunFunction(options, [optionsFunctionValues], [], optionsFunctionThis);
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
        if(isArray(referenceTos)){
            labelInValue=true;
            let defaultReferenceToValue:any = [];
            if(value){
                const recordList = referenceToObject.getRecordList(referenceTofilters, fields);
                // 下拉框选中某个选项，获取其对应的lable。因为如果加下面的isloading判断，就会在重新选择其它选项时会有isLoading状态的效果， 所以不需要下面这行isloading判断。
                // if (recordList.isLoading) return (<div><Spin/></div>);
                recordListData = recordList.data;
                if (recordListData && recordListData.value && recordListData.value.length > 0) {
                    forEach(recordListData.value, (recordItem: any) => {
                        let valueLabel = { value: recordItem[reference_to_field], label: recordItem[referenceToLableField] };
                        defaultReferenceToValue.push(valueLabel)
                    })
                }
            }
            if(!multiple){
                defaultReferenceToValue = defaultReferenceToValue[0];
            }
            let idsValue = [];
            newFieldProps = Object.assign({}, fieldProps, {
                value: selectedValue ? selectedValue : defaultReferenceToValue,
                onChange:(values: any, option: any)=>{
                    let tempSelectedValue:any = undefined;
                    if (multiple) {
                        tempSelectedValue=[];
                        forEach(values, (item) => {
                            idsValue.push(item.value);
                            tempSelectedValue.push({value: item.value, label: item.label})
                        })
                    } else {
                        if(values.value){ idsValue = [values.value]; }
                        tempSelectedValue = {value: values.value, label:values.label};
                    }
                    setSelectedValue(tempSelectedValue)
                    onChange({o: referenceTo, ids: idsValue })
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
        let proFieldProps: any;
        let dropdownRender;
        if(create && referenceTo){
            const createObjectName = referenceToObjectSchema.label;
            dropdownRender = (menu)=>{
            return (
                <React.Fragment>
                    {menu}
                    <ObjectForm
                        // initialValues={initialValues} 
                        key="standard_new" 
                        title={`新建 ${createObjectName}`} 
                        mode="edit" 
                        isModalForm={true} 
                        objectApiName={referenceTo} 
                        name={`form-new-${referenceTo}`} 
                        submitter={false}
                        trigger={
                            <a className="add_button text-blue-600 hover:text-blue-500 hover:underlin"  onClick={()=>{
                                // 新建弹出后新建按钮应该隐藏掉
                                setIsDropdownOpen(false);
                            }} >
                                <PlusOutlined /> 新建 {createObjectName}
                            </a>
                        } 
                    />
                </React.Fragment>
            )
            }
        }
        let showModal = ["dialog", "drawer"].indexOf(modal_mode) > -1 || (referenceToObjectSchema &&  referenceToObjectSchema.enable_enhanced_lookup)
        if(options){
            showModal = false;
        }
        const isLookupTree = !showModal && referenceToObjectSchema && referenceToObjectSchema.enable_tree;
        let modalDom: any;
        let proFieldPropsForDropdown = {
            open: isDropdownOpen,
            onClick: (e)=>{
                if(e.target.closest(".ant-select")){
                    setIsDropdownOpen(true);
                }
                rest.onClick && rest.onClick(e);
            },
            onBlur: (e)=>{
                // 加setTimeout的原因是立即隐藏下拉选项会造成下拉选项底部的新建按钮事件不生效
                setTimeout(()=>{
                    setIsDropdownOpen(false);
                }, 500);
                rest.onBlur && rest.onBlur(e);
            },
            onSelect: (value: any, option: any)=>{
                setIsDropdownOpen(false);
                rest.onSelect && rest.onSelect(value, option);
            }
        };
        if(isLookupTree){
            //主要用到了newFieldProps中的onChange和value属性
            proFieldProps = Object.assign({}, {...newFieldProps}, {
                objectApiName: referenceTo,
                multiple,
                filters: fieldFilters,
                filtersFunction,
                nameField: referenceToLableField,
                parentField: referenceParentField,
                ...proFieldPropsForDropdown
            })
        }
        else{
            let proFieldPropsForModal = {};
            if(showModal){
                proFieldPropsForModal = {
                    showSearch: false,
                    onDropdownVisibleChange: false,
                    open: false,
                    onClick: null,
                    onBlur: null, 
                    onSelect: null
                }
                modalDom = (trigger: any)=>{
                    let ModalComponent = ObjectModal;
                    let modalPorps:any = {
                        title: `选择 ${referenceToObjectSchema.label}`,
                        objectApiName: referenceTo,
                        multiple,
                        value,
                        // 弹出框会返回rowKey对应的字段值，默认为_id，比如space_users要求返回user字段值
                        rowKey: reference_to_field,
                        // filters: filtersFunction ? filtersFunction(fieldFilters) : fieldFilters,
                        filters: filtersFunction ? safeRunFunction(filtersFunction,[fieldFilters],[]) : fieldFilters,
                        trigger,
                        onFinish: onModalFinish
                    };
                    if(table_schema){
                        if(isObject(table_schema) && !isEmpty(table_schema)){
                            modalPorps.listSchema = table_schema;
                        }
                        if(isString(table_schema)){
                            modalPorps.listName = table_schema;
                        }
                    }                
                    if(referenceTo === "space_users"){
                        ModalComponent = SpaceUsersModal;
                        Object.assign(modalPorps, {
                            columnFields: undefined //使用SpaceUsersModal默认定义的columnFields
                        })
                    }
                    else if(referenceTo === "organizations"){
                        ModalComponent = OrganizationsModal;
                    }
                    return (
                        <ModalComponent {...modalPorps}/>
                    )
                };
            }
            proFieldProps = {
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
                dropdownRender,
                ...rest,
                ...proFieldPropsForDropdown,
                ...proFieldPropsForModal
            }
        }
        const referenceToSelectProps = {
            mode: mode,
            showArrow: true,
            optionFilterProp: 'label',
            onChange: (value: any) => {
                setReferenceTo(value)
            },
            dropdownMatchSelectWidth:172,
            defaultValue:referenceTo
        }
        const needReferenceToSelect = isArray(referenceTos) && !isArray(options)
        let referenceToOptions:any = [];
        let isLoadingReferenceTosObject;
        if(needReferenceToSelect){
            forEach(referenceTos,(val)=>{
                const referenceToObject = Objects.getObject(val);
                referenceToObjectSchema = referenceToObject.schema;
                let referenceToObjectLeftIcon;
                if(referenceToObjectSchema.icon){
                    referenceToObjectLeftIcon = referenceToObjectSchema.icon;
                }
                if (!referenceToObject.isLoading){
                    if(referenceToObjectLeftIcon){
                        referenceToOptions.push({label:referenceToObjectSchema.label,value:val,icon:referenceToObjectLeftIcon})
                    }else{
                        referenceToOptions.push({label:referenceToObjectSchema.label,value:val})
                    }   
                }
            })
            isLoadingReferenceTosObject = referenceToOptions.length !== referenceTos.length;
        }
        if(isLoadingReferenceTosObject) return (<div><Spin/></div>)

        const lookupInput = isLookupTree ? (<ObjectFieldTreeSelect {...proFieldProps}  />) : (<FieldSelect {...proFieldProps} />);
        const onModalFinish = (selectedRowKeys: any, selectedRows: any)=>{
            // ag-grid只传一个参数（rows）过来，这里获取其内部的value。
            if(!selectedRows){
                selectedRowKeys = map(selectedRowKeys,reference_to_field)
            }
            let changedValue = multiple ? selectedRowKeys : selectedRowKeys[0];
            onChange(changedValue);
            setParams({ open:false, openTag: new Date() });
        }
        return (
            <React.Fragment>
                {
                    needReferenceToSelect && 
                    (<Select   {...referenceToSelectProps} className="left_label_menu">
                    {
                        map(referenceToOptions,(item)=>{
                            return (
                            <Option value={item.value} key={item.value}>
                                {item.icon ? <span role="img" aria-label="smile" className="anticon anticon-smile"><SteedosIcon name={item.icon} size="x-small"/></span> : null}
                                <span className="left_label">{item.label}</span>
                            </Option>)
                        })
                    }
                    </Select>)
                }
                {showModal ? modalDom(lookupInput) : lookupInput}
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