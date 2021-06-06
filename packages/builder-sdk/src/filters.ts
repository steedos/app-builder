import { map, isNil, compact } from 'lodash';

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
            else{
                // avatar,grid,image,object不支持过滤功能
                // currency,datetime,number,parcent,summary需要按范围字段来处理过滤功能
                // formula要根据关联字段类型做相关处理
                return [k, "between", [v, v]];
            }
        }
        else{
            return null;
        }
    });
    return compact(result);
}