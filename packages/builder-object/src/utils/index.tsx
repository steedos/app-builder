import _ from 'lodash';

/**
 * 根据字段名称返回组件需要的字段属性
 * @param fieldName 字段名称
 * @param objectConfig 对象配置文件中该字段所属对象的配置
 * @returns 组件需要的字段属性
 */
export function getFieldProps(fieldName: string, objectConfig: any) {
  const field: any = _.find(objectConfig.fields, (field, key) => {
    return fieldName === key;
  });
  const fieldType = field.type;
  let result: any;
  switch(fieldType){
    case "object":
      // 根据对象的子表字段信息，返回子表配置属性
      let subFields: any[] = [];
      _.each(objectConfig.fields, (field, key) => {
        if(key.startsWith(`${fieldName}.`)){
          subFields.push(field);
        }
      });
      result = Object.assign({}, field, {subFields});
      break;
    default:
      result = field;
      break;
  }
  return result;
}