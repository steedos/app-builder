import React, { useState , useRef} from "react";
import { formatFiltersToODataQuery } from '@steedos/filters';
import { Spin, TreeSelect } from 'antd';
import "antd/es/tree-select/style/index.css";
import { isArray } from 'lodash';
import { Objects, API } from '@steedos/builder-store';
import { observer } from "mobx-react-lite";
import { getTreeDataFromRecords } from '../utils';
import { safeRunFunction, BAD_FILTERS } from '../utils';

export const ObjectFieldTreeSelect = observer((props:any)=> {
  const [params, setParams] = useState({open: false,openTag: null});
  const [opened, setOpened] = useState(false);
  const { objectApiName, nameField = "name", parentField = "parent", filters: fieldFilters = [],filtersFunction, value, onChange, ...rest } = props;
//   let filters: any[] | string =  filtersFunction ? filtersFunction(fieldFilters) : fieldFilters;
  let filters: any[] | string =  filtersFunction ? safeRunFunction(filtersFunction,[fieldFilters],BAD_FILTERS) : fieldFilters;
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