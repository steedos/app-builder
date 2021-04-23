import _ from 'lodash';

export function saveEval(js: string){
	try{
		return eval(js)
	}catch (e){
		console.error(e, js);
	}
};

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
 * 转换传入的objectConfig中的 object, grid 类型字段，生成 sub_fields 属性，相关函数为字段串格式转换为函数
 * @param objectConfig 对象配置文件中字段所属对象的配置
 * @returns 转换后的fields
 */
 export function getFieldsSchema(objectConfig: any) {
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
  return fieldsSchema;
}


/**
  视图过虑器需要支持function，后台转成字符串，前台eval成函数
  让过虑器支持两种function方式：
  1. 整个filters为function:
  如：
  filters: ()->
    return [[["object_name","=","project_issues"],'or',["object_name","=","tasks"]]]
  2. filters内的filter.value为function
  如：
  filters: [["object_name", "=", ()->
    return "project_issues"
  ]]
  或
  filters: [{
    "field": "object_name"
    "operation": "="
    "value": ()->
      return "project_issues"
  }]
 */
const getListViewSchema = (listView: any)=>{
  if(listView._filters){
    let filters = saveEval(`(${listView._filters})`);
    return Object.assign({}, listView, {filters});
  }
  else if(_.isArray(listView.filters)){
    _.forEach(listView.filters, function(filter: any, _index) {
      if (_.isArray(filter)) {
        if (filter.length === 4 && _.isString(filter[2]) && filter[3] === "FUNCTION") {
          filter[2] = saveEval("(" + filter[2] + ")");
          filter.pop();
        }
        if (filter.length === 4 && _.isString(filter[2]) && filter[3] === "DATE") {
          filter[2] = new Date(filter[2]);
          return filter.pop();
        }
      } else if (_.isObject(filter) as any) {
        if (_.isString(filter && filter._value)) {
          return filter.value = saveEval("(" + filter._value + ")");
        } else if (filter._is_date === true) {
          return filter.value = new Date(filter.value);
        }
      }
    });
    return listView;
  }
  else{
    return listView;
  }
}

/**
 * 转换传入的objectConfig中list_views，相关函数为字段串格式转换为函数
 * @param objectConfig 对象配置文件中列表视图所属对象的配置
 * @returns 转换后的list_views
 */
 export function getListViewsSchema(objectConfig: any) {
  let listViewsSchema: any = {}
  _.each(objectConfig.list_views, (listView, listName) => {
    const listViewSchema = getListViewSchema(listView);
    if(listViewSchema){
      listViewsSchema[listName] = listViewSchema;
    }
  });
  return listViewsSchema;
}

/**
 * 转换传入的objectConfig中的fields及list_views
 * @param objectConfig 对象配置文件中该字段所属对象的配置
 * @returns 转换后的对象
 */
 export function convertObjectSchema(objectConfig: any) {
  objectConfig.fields = getFieldsSchema(objectConfig);
  // console.log("convertObjectSchema====objectConfig.fields===", objectConfig.name, objectConfig.fields);
  objectConfig.list_views = getListViewsSchema(objectConfig);
  // console.log("convertObjectSchema====objectConfig.list_views===", objectConfig.name, objectConfig.list_views);
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