import React, { useContext, useEffect, useState, useImperativeHandle } from "react";
import { forEach, defaults, groupBy, filter, map, defaultsDeep, isObject, isBoolean, cloneDeep, sortBy, has} from 'lodash';
import { ObjectField } from "./ObjectField";
import { observer } from "mobx-react-lite"
import stores, { Objects, Forms, API, Settings } from '@steedos/builder-store';
import { FieldSection } from "@steedos/builder-form";
import { Spin } from 'antd';
import { isDeepEqual, parseAllExpression, schemaContainsExpression } from "../utils/utils";

/*
  fields: 字段定义数组，格式同YML
*/
export type ObjectFormSectionsProps = {
  objectApiName?: string,
  fields?: [string],
  objectSchema?: any,
  recordId?: string
  isModalForm?: boolean,
  mode?: 'read' | 'edit',
  editable?: boolean,
  onRef?: any,
  formData?: any
}

const getFieldSchemaArray = (mergedSchema, fields, isModalForm)=>{
  let fieldSchemaArray = [];
  fieldSchemaArray.length = 0

  const fieldsArr = [];
  forEach(mergedSchema.fields, (field, fieldName)=>{
    if(!has(field, "name")){
      field.name = fieldName
    }
		fieldsArr.push(field)
  })

  forEach(sortBy(mergedSchema.fields, "sort_no"), (field) => {
    if (!field.group || field.group == 'null' || field.group == '-')
      field.group = '通用'
    const fieldName = field.name;
    let isObjectField = /\w+\.\w+/.test(fieldName)
    if (field.type == 'grid' || field.type == 'object') {
      // field.group = field.label
      field.is_wide = true;
    }
    // 新建记录时，把autonumber、formula、summary类型字段视为omit字段不显示
    let isOmitField = isModalForm && ["autonumber", "formula", "summary"].indexOf(field.type) > -1;
    let isValid = !fields || !fields.length || fields.indexOf(fieldName) > -1
    if (!field.hidden && !isObjectField && !isOmitField && isValid){
      fieldSchemaArray.push(defaults({name: fieldName}, field))
    }
  })
  return fieldSchemaArray;
}

const getSection = (objectApiName, fieldSchemaArray, isModalForm, mode, sectionName, options) => {
  const sectionFields = filter(fieldSchemaArray, { 'group': sectionName });
  const columns = isModalForm ? 2 : undefined
  return (
    <FieldSection title={sectionName} key={sectionName} columns={columns} {...options}>
      {map(sectionFields, (field:any)=>{
        const fieldProps = {
          key: field.name,
          name: field.name,
          objectApiName,
          fieldName: field.name,
          label: field.label,
          fieldSchema: field,
          mode,
        };
        return (<ObjectField {...fieldProps} />)
      })}
    </FieldSection>
  )
}

const getSections = (objectApiName, mergedSchema, fields, isModalForm, mode, formData) => {
  const _schema = cloneDeep(mergedSchema);
  forEach(_schema.fields, (field, key)=>{
    if (schemaContainsExpression(field)) {
      Object.assign(field, parseAllExpression(field, formData, "#"));
      if(field.visible_on === false){
        field.hidden = true;
      }
    }
  })

  const fieldSchemaArray = getFieldSchemaArray(_schema, fields, isModalForm)
  const sections = groupBy(fieldSchemaArray, 'group');
  const dom = [];
  const options = (Object.keys(sections).length == 1)?{titleHidden: true}: {}
  forEach(sections, (value, key) => {
   dom.push(getSection(objectApiName, fieldSchemaArray, isModalForm, mode, key, options))
 })
 return dom;
}

export const ObjectFormSections = observer((props:ObjectFormSectionsProps) => {
  const {
    objectApiName,
    fields = [],//只显示指定字段
    objectSchema = {}, // 和对象定义中的fields格式相同，merge之后 render。
    formData={},
    mode = 'edit',
    isModalForm,
    onRef
  } = props;
  let setTimeoutId = null;

  useImperativeHandle(props.onRef, () => {
    return {
      reCalcSchema: function(event, value){
        if(setTimeoutId != null){
          clearTimeout(setTimeoutId);
        }
        setTimeoutId = setTimeout(()=>{
          const newSections = getSections(objectApiName, objectSchema, fields, isModalForm, mode, value);
          if(!isDeepEqual(sections, newSections)){
            setSections(newSections)
          }
        }, 200)
      },
    };
  });
  const [sections, setSections] = useState([]);

  const object = objectApiName? Objects.getObject(objectApiName): null;
  if (object && object.isLoading) return (<div><Spin/></div>)

  useEffect(() => {
    setSections(getSections(objectApiName, objectSchema, fields, isModalForm, mode, formData))
  }, [JSON.stringify(objectSchema), JSON.stringify(formData)]);

  return (
    <>
      {sections}
    </>
  )
});
