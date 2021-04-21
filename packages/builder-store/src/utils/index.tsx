import _ from 'lodash';

const getFieldSchema = (fieldName: any, objectConfig: any)=>{
  let fieldSchema: any = {};
  const field = objectConfig.fields[fieldName];
  const fieldType = field && field.type;
  let sub_fields: any;
  // fieldName变量中可能带$和.符号，需要转换成RegExp匹配的带转义符的字符
  const fieldNameForReg = fieldName.replace(/\$/g,"\\$").replace(/\./g,"\\.");
  switch(fieldType){
    case "object":
      // 根据对象的子表字段信息，返回子表配置属性
      sub_fields = {};
      _.each(objectConfig.fields, (fieldItem, key) => {
        const reg = new RegExp(`^${fieldNameForReg}\\.\\\w+$`); //以fieldName开头，且用.号连接下一个字段名
        // if(key.startsWith(`${fieldName}.`)){
        if(reg.test(key)){
          // members.users、instances.$._id、sharing.$之类的复合字段中取出最后一个.字段名，但是不匹配$结尾的字段名
          let matches = key.match(/.(\w+)$/g);
          let lastFieldKey = matches && matches[0].replace(".", "");
          if(lastFieldKey){
            sub_fields[lastFieldKey] = getFieldSchema(key, objectConfig);   ;                           
          }
        }
      });
      fieldSchema = Object.assign({}, field, {sub_fields});
      break;
    case "grid":
      // 根据对象的子表字段信息，返回子表配置属性
      sub_fields = {};
      _.each(objectConfig.fields, (fieldItem, key) => {
        const reg = new RegExp(`^${fieldNameForReg}\\.\\$\\.\\\w+$`); //以fieldName开头，且后面接着用.$.号连接下一个字段名
        // if(key.startsWith(`${fieldName}.$.`)){
        if(reg.test(key)){
          // members.users、instances.$._id、sharing.$之类的复合字段中取出最后一个.字段名，但是不匹配$结尾的字段名
          let matches = key.match(/.(\w+)$/g);
          let lastFieldKey = matches && matches[0].replace(".", "");
          if(lastFieldKey){
            sub_fields[lastFieldKey] = getFieldSchema(key, objectConfig);                           
          }
        }
      });
      fieldSchema = Object.assign({}, field, {sub_fields});
      break;
    case "lookup":
      if(field.reference_to === "users"){
        fieldSchema = Object.assign({}, field, {
          reference_to: "space_users",
          reference_to_field: "user"
        });
      }
      else{
        fieldSchema = field;
      }
      break;
    default:
      fieldSchema = field;
      break;
  }
  return fieldSchema;
}

/**
 * 转换传入的objectConfig中的 object, grid 类型字段，生成 sub_fields 属性
 * @param objectConfig 对象配置文件中该字段所属对象的配置
 * @returns 转换后的对象
 */
 export function convertFieldsSchema(objectConfig: any) {
  let fieldsSchema: any = {}
  // console.log("convertFieldsSchema===", objectConfig.name, JSON.stringify(objectConfig.fields));
  _.each(objectConfig.fields, (field, fieldName) => {
    if(/\w+\.($\.)?(\w+)?/.test(fieldName)){
      // 所有的members.users、instances.$._id、sharing.$之类的复合字段会根据需要自动加到sub_fields中，所以不用再加到fieldsSchema中
      return;
    }
    const fieldSchema = getFieldSchema(fieldName, objectConfig);
    if(fieldSchema){
      fieldsSchema[fieldName] = fieldSchema;
    }
  });
  // console.log("convertFieldsSchema====fieldsSchema===", objectConfig.name, fieldsSchema);
  objectConfig.fields = fieldsSchema;
}

export function getObjectOdataExpandFields(object: any,columns: string[]) {
  var expand_fields, fields:[];
  expand_fields = [];
  fields = object.fields;
  if (!columns) {
    columns = _.keys(fields);
  }
  _.each(columns,(n)=>{
    var ref1, ref2;
    if (((ref1 = fields[n]) != null ? ref1.type : void 0) === "master_detail" || ((ref2 = fields[n]) != null ? ref2.type : void 0) === "lookup") {
      return expand_fields.push(n)
    }
  })
  return expand_fields.join(",");
}