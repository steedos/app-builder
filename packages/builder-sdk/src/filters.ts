import { map, isNil, compact, each } from 'lodash';

/**
 * 根据表单的对象配置及表单值，计算得到对应的过滤条件
 * @param objectSchema 
 * @param formValues 
 * @returns 转换后的过滤条件
 */
export const convertFormToFilters = (objectSchema: any, formValues: any)=>{
    // console.log("===convertFormToFilters=objectSchema==", objectSchema);
    let result =  map(formValues, (v, k)=>{
        let field = objectSchema.fields[k];
        if(field && !isNil(v)){
            if(["text", "textarea", "autonumber", "email", "url"].indexOf(field.type) > -1 && v){
                return [k, "contains", v];
            }
            else if(["boolean", "lookup", "master_detail", "select", "toggle"].indexOf(field.type) > -1){
                return [k, "=", v];
            }
            else if(["date", "datetime"].indexOf(field.type) > -1){
                return [k, "between", [v, v]];
            }
            else if(["date_range", "datetime_range"].indexOf(field.type) > -1){
                return [k, "between", v];
            }
            else{
                // avatar,grid,image,object不支持过滤功能
                // currency,datetime,date,number,parcent,summary需要按范围字段来处理过滤功能
                // formula要根据关联字段类型做相关处理
                return null;
            }
        }
        else{
            return null;
        }
    });
    return compact(result);
}

/**
 * 根据表单的对象配置，计算其用于过滤器组件时需要变更的配置
 * 比如是数值或日期字段应该变更为范围字段类型
 * @param objectSchema 
 * @param fields 如果提供该参数则只需要转换这些指定字段
 */
export const getFilterFormSchema = (objectSchema: any, fields?: [string])=>{
    let schemaFields = {};
    each(objectSchema.fields, (fieldItem, fieldKey)=>{
        if(fields && fields.length && fields.indexOf(fieldKey) < 0){
            return;
        }
        let extendProps: any = {};
        switch(fieldItem.type){
            case "date":
                extendProps.type = "date_range";
                break;
            case "datetime":
                extendProps.type = "datetime_range";
                break;
            case "number":
                extendProps.type = "number_range";
                break;
        }
        schemaFields[fieldKey] = Object.assign({}, fieldItem, extendProps);
    });
    return Object.assign({}, objectSchema, { fields: schemaFields });
}