export default class ObjectField {
    isEditable(object_name, fieldSchema, record){
        if(window.Creator && window.Creator.getObject){
            const obj = window.Creator.getObject(object_name);
            if(!obj){
                return false;
            }
            if(!fieldSchema){
                return false;
            }
            const safeField = window.Creator.getRecordSafeField(fieldSchema, record, object_name);
            if(!safeField){
                return false
            }
            if(safeField.omit || safeField.readonly){
                return false
            }
            if(safeField.type === "filesize"){
                return false
            }
            if(safeField.name == '_id'){
                return false
            }
            const permission = window.Creator.getRecordPermissions(object_name, record, window.Meteor.userId());
            if(!permission.allowEdit){
                return false
            }
            return true
        }else{
            return !fieldSchema.readonly
        }
    }
}