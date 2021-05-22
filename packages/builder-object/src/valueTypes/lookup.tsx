import React, { useState , useRef} from "react";
import { formatFiltersToODataQuery } from '@steedos/filters';
import { Select, Spin, TreeSelect } from 'antd';
import "antd/es/tree-select/style/index.css";
import { isFunction, isArray, isObject, uniq, filter, map, forEach} from 'lodash';
import { Objects, API } from '@steedos/builder-store';
import { observer } from "mobx-react-lite";
import FieldSelect from '@ant-design/pro-field/es/components/Select';
import { Link } from "react-router-dom";
import { getObjectRecordUrl } from "../utils";
import { SteedosIcon } from '@steedos/builder-lightning';
import { getTreeDataFromRecords } from '../utils';
import "./lookup.less"
import { PlusOutlined } from "@ant-design/icons";
import { isString } from "lodash"
import { ObjectForm, ObjectTable, ObjectExpandTable, ObjectModal, ObjectTableModal } from "../components";

const { Option } = Select;
// 相关表类型字段
// 通过下拉框显示相关表中的数据，可以搜索
// 参数 props.reference_to:
export const LookupField = observer((props:any) => {
    const [params, setParams] = useState({open: false,openTag: null});
    const selectRef:any = useRef()
    const { valueType, mode, fieldProps, request, ...rest } = props;
    const { field_schema: fieldSchema = {},depend_field_values: dependFieldValues={},onChange } = fieldProps;
    let { reference_to, reference_sort,reference_limit, showIcon, multiple, reference_to_field = "_id", filters: fieldFilters = [],filtersFunction, create, modal_mode, modal_schema } = fieldSchema;
    let value= fieldProps.value || props.text;//ProTable那边fieldProps.value没有值，只能用text
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
    let [selectItemLabel, setSelectItemLabel] = useState('');
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
            if (referenceTo) {
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
                options = isFunction(options) ? options(dependFieldValues) : options;
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
        let rowSelectionType="radio";
        if (multiple){
            fieldProps.mode = 'multiple';
            rowSelectionType="checkbox";
        } 

        let dependOnValues: any = dependFieldValues;
        let request: any;
        let labelInValue=false;
        let requestFun= async (params: any, props: any) => {
            // 注意，request 里面的代码不会抛异常，包括编译错误。
            // console.log("===request===params, props==", params, props);
            // console.log("===request===reference_to==", reference_to);

            if(isFunction(options)) {
                dependOnValues.__keyWords = params.keyWords;
                dependOnValues.__referenceTo = referenceTo;
                const results = await options(dependOnValues);
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
                    let filtersOfField:[] =  filtersFunction ? filtersFunction(fieldFilters) : fieldFilters;
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

        let showModal = ["dialog", "drawer"].indexOf(modal_mode) > -1 || referenceTo === "space_users";

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
        if(isArray(referenceTos)){
            labelInValue=true;
            if(value){
                const recordList = referenceToObject.getRecordList(referenceTofilters, fields);
                // 根据ID获取请求 获取对应的 label。 不需要下面这行isloading判断
                // if (recordList.isLoading) return (<div><Spin/></div>);
                recordListData = recordList.data;
                if (recordListData && recordListData.value && recordListData.value.length > 0) {
                    selectItemLabel = recordListData.value.map((recordItem: any)=>{
                        return recordItem[referenceToLableField];
                    }).join(",");
                }
            }
            newFieldProps = Object.assign({}, fieldProps, {
                value: {value: fieldProps.value,label: selectItemLabel},
                onChange:(values: any, option: any)=>{
                    setSelectItemLabel(values.label)
                    onChange({o: referenceTo, ids: (values.value ? [values.value] : [])})
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
        const isLookupTree = referenceToObjectSchema && referenceToObjectSchema.enable_tree;
        let dropdownRender;
        if(create && referenceTo){
            dropdownRender = (menu)=>{
            return (
                <React.Fragment>
                    {menu}
                    <ObjectForm
                        // initialValues={initialValues} 
                        key="standard_new" 
                        title={`新建 ${referenceToObjectSchema.label}`} 
                        mode="edit" 
                        isModalForm={true} 
                        objectApiName={referenceTo} 
                        name={`form-new-${referenceTo}`} 
                        submitter={false}
                        trigger={
                            <a className="add_button text-blue-600 hover:text-blue-500 hover:underlin"  onClick={()=>{
                                // 新建弹出后新建按钮应该隐藏掉
                                selectRef.current.blur();
                            }} >
                                <PlusOutlined /> 新建 {referenceToObjectSchema.label}
                            </a>
                        } 
                    />
                </React.Fragment>
            )
            }
        }
        if(isLookupTree){
            //主要用到了newFieldProps中的onChange和value属性
            proFieldProps = Object.assign({}, {...newFieldProps}, {
                objectApiName: referenceTo,
                multiple,
                filters: fieldFilters,
                filtersFunction,
                nameField: referenceToLableField,
                parentField: referenceParentField
            })
        }
        else{
            let proFieldPropsForModal = {};
            if(showModal){
                proFieldPropsForModal = {
                    showSearch: false,
                    onDropdownVisibleChange: false,
                    open: false
                }
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

        const lookupInput = isLookupTree ? (<FieldTreeSelect {...proFieldProps}  />) : (<FieldSelect ref={selectRef} {...proFieldProps} />);
        const onModalFinish = (selectedRowKeys: any, selectedRows: any)=>{
            // console.log("==selectedRowKeys==", selectedRowKeys);
            // console.log("==selectedRows==", selectedRows);
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
                {showModal ? (
                    <ObjectModal
                        contentComponent={ObjectExpandTable}
                        title={`选择 ${referenceToObjectSchema.label}`}
                        objectApiName={referenceTo}
                        rowSelection={{type: rowSelectionType }}
                        // space_user 默认传的是_id
                        rowKey={reference_to_field}
                        columnFields={[
                            {
                                fieldName: "name"
                            },
                            {
                                fieldName: "user",
                                hideInTable: true,
                            }
                        ]}
                        filters={[]}
                        trigger={lookupInput} 
                        onFinish={onModalFinish}
                    />
                ) : lookupInput}
            </React.Fragment>
        )
    }
});

export const FieldTreeSelect = observer((props:any)=> {
    const [params, setParams] = useState({open: false,openTag: null});
    const [opened, setOpened] = useState(false);
    const { objectApiName, nameField = "name", parentField = "parent", filters: fieldFilters = [],filtersFunction, value, onChange, ...rest } = props;
    let filters: any[] | string =  filtersFunction ? filtersFunction(fieldFilters) : fieldFilters;
    const keyFilters: any = ['_id', '=', value];
    if(params.open){
        if(value && value.length && filters && filters.length){
            if (isArray(filters)) {
                filters = [keyFilters, "or", filters]
            }
            else {
                const odataKeyFilters = formatFiltersToODataQuery(keyFilters);
                filters = `(${odataKeyFilters}) or (${filters})`;
            }
        }
    }
    if(!params.open && !opened){
        // 未展开下拉菜单时，只请求value对应的记录，value为空时为null，正好返回空数据
        // 加opened条件是因为之前请求过完整数据就没必要再按keyFilters请求一次部分数据，避免下次再点开下拉菜单时请求整棵树。
        filters = keyFilters;
    }
    let fields = [nameField, parentField]
    const object = Objects.getObject(objectApiName);
    if (object.isLoading) return (<div><Spin/></div>);
    let treeData = [];
    let treeNameField = nameField;
    if(objectApiName==='organizations'){
        fields.push('name')
        if(params.open){
            treeNameField = 'name'
        }
    }
    let treeDefaultExpandedKeys: string[];
    const recordList: any = object.getRecordList(filters, fields);
    if (recordList.isLoading) return (<div><Spin/></div>);
    const recordListData = recordList.data;
    if (recordListData && recordListData.value && recordListData.value.length > 0) {
        treeData = getTreeDataFromRecords(recordListData.value, treeNameField, parentField);
    }
    if (value && value.length) {
        if (isArray(value)) {
            treeDefaultExpandedKeys = value
        } else {
            treeDefaultExpandedKeys = [value]
        }
    } else {
        if (treeData && treeData.length) {
            const rootNodeValues = treeData.map((treeItem) => {
                return treeItem.value;
            });
            treeDefaultExpandedKeys = rootNodeValues;
        }
    }
    return (
      <TreeSelect
        // loading={recordList.isLoading}
        treeNodeFilterProp="title"
        allowClear
        showSearch={true}
        style={{ width: '100%' }}
        value={value}
        // value={recordList.isLoading ? null: value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        placeholder="请选择"
        // treeDefaultExpandAll
        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
        open={params.open}
        onDropdownVisibleChange={(open: boolean) => {
            if (open && !opened) {
                setOpened(true)
            }
            setParams({ open, openTag: new Date() });
        }}
        onChange={onChange}
        {...rest}
      />
    );
});

export const lookup = {
    render: (text: any, props: any) => {
        return (<LookupField {...props} mode="read"></LookupField>)
    },
    renderFormItem: (text: any, props: any) => {
        return (<LookupField {...props} mode="edit"></LookupField>)
    }
}