import React, { useRef } from 'react';
// import RenderList from './RenderChildren/RenderList';
import RenderObject from './RenderChildren/RenderObject';
import RenderSection from './RenderChildren/RenderSection';
import RenderField from './RenderField';
import { useStore, useStore2 } from '../utils/hooks';
import { isBoolean } from 'lodash';
import {
  isLooselyNumber,
  isCssLength,
  getParentProps,
  isListType,
  isCheckBoxType,
  isObjType,
  isSectionType,
  getValueByPath,
  getDataPath,
  clone,
  schemaContainsExpression,
  parseAllExpression,
} from '../utils/utils';

const Core = ({
  id = '#',
  _item, // 如果直接传了item，就不用id去取item, 暂时是内部属性，不外用
  dataIndex = [], // 数据来源是数组的第几个index，上层每有一个list，就push一个index
  hideTitle = false,
  hideValidation = false,
  debugCss,
  ...rest
}:any) => {
  // console.log('<Core>');
  const snapShot = useRef();

  const { flatten, errorFields, isEditing, formData, allTouched } = useStore();
  const { displayType, column, labelWidth, readOnly } = useStore2();
  const item = _item ? _item : flatten[id];
  if (!item) return null;
  let schema = clone(item.schema); // TODO: 用deepClone，函数啥的才能正常copy，但是deepClone的代价是不是有点大，是否应该让用户避免schema里写函数
  let dataPath = getDataPath(id, dataIndex);
  // 分组下的字段值提到顶层处理
  if(schema.group){
    dataPath = dataPath.split('.')[1];
  }
  const _value = getValueByPath(formData, dataPath);
  // 节流部分逻辑，编辑时不执行
  if (isEditing && snapShot.current) {
    schema = snapShot.current;
  } else {
    if (schemaContainsExpression(schema)) {
      console.log(`parseAllExpression`, schema, formData)
      schema = parseAllExpression(schema, formData, dataPath);
    }
    snapShot.current = schema;
  }

  // 真正有效的label宽度需要从现在所在item开始一直往上回溯（设计成了继承关系），找到的第一个有值的 ui:labelWidth
  const effectiveLabelWidth =
    getParentProps('labelWidth', id, flatten) || labelWidth;

  const dataProps = {
    id,
    item, // 如果直接传了item，就不用id去取item, 暂时是内部属性，不外用
    dataIndex, // 数据来源是数组的第几个index，上层每有一个list，就push一个index
    dataPath,
    _value,
    hideTitle,
    hideValidation,
    debugCss,
    schema,
    displayType,
    column,
    labelWidth,
    readOnly,
    errorFields,
    effectiveLabelWidth,
    allTouched,
    ...rest,
  };

  return <MCore {...dataProps} />;
};

const CoreRender = ({
  id,
  item,
  dataIndex,
  dataPath,
  hideTitle,
  hideValidation,
  debugCss,
  schema,
  _value,
  displayType,
  column,
  labelWidth,
  readOnly,
  errorFields,
  effectiveLabelWidth,
  ...rest
}) => {

  if (schema.hidden || (isBoolean(schema.visible_on) && !schema.visible_on)) {
    return null;
  }
  // 样式的逻辑全放在这层
  // displayType 一层层网上找值
  const _displayType =
    schema.displayType || rest.displayType || displayType || 'column';
  const isList = isListType(schema);
  const isObj = isObjType(schema);
  const isSection = isSectionType(schema);
  const isCheckBox = isCheckBoxType(schema, readOnly);

  const hasChildren = item.children && item.children.length > 0;

  const fieldProps = {
    $id: id,
    dataIndex,
    dataPath,
    _value,
    _schema: schema,
    errorFields,
    // 层级间可使用的字段
    displayType: _displayType,
    hideTitle,
    hideValidation,
  };

  const objChildren = (
    <RenderObject
        dataIndex={dataIndex}
        displayType={_displayType}
        hideTitle={hideTitle}
      >
        {item.children}
      </RenderObject>
  );
  const sectionChidren = (
    <RenderSection
        dataIndex={dataIndex}
        displayType={_displayType}
        title={schema.label}
        hideTitle={schema.hideTitle}
      >
        {item.children}
      </RenderSection>
  )

  // const listChildren = (
  //   <RenderList
  //     parentId={id}
  //     schema={schema}
  //     dataIndex={dataIndex}
  //     errorFields={errorFields}
  //     displayType={_displayType}
  //     hideTitle={hideTitle}
  //   >
  //     {item.children}
  //   </RenderList>
  // );

  // 计算 children
  let _children = null;
  if (hasChildren) {
    if (isObj) {
      _children = objChildren;
    }else if(isSection){
      _children = sectionChidren;
    }
    else if (isList) {
      // _children = listChildren;
    }
  } else if (isCheckBox) {
    _children = schema.title;
  }
  return (
    <RenderField {...fieldProps}>{_children}</RenderField>
  );
};

const areEqual = (prev, current) => {
  if (prev.allTouched !== current.allTouched) {
    return false;
  }
  if (prev.displayType !== current.displayType) {
    return false;
  }
  if (prev.column !== current.column) {
    return false;
  }
  if (prev.labelWidth !== current.labelWidth) {
    return false;
  }
  if (
    JSON.stringify(prev._value) === JSON.stringify(current._value) &&
    JSON.stringify(prev.schema) === JSON.stringify(current.schema) &&
    JSON.stringify(prev.errorFields) === JSON.stringify(current.errorFields)
  ) {
    return true;
  }
  return false;
};

const MCore = React.memo(CoreRender, areEqual);

export default Core;
