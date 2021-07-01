export default class Action {
    executeAction(object_name, action, record_id, item_element, list_view_id, record){
        if(window.Meteor){
            const object = window.Creator.getObject(object_name)
            const collectionName = object.label
            window.Session.set("action_fields", undefined)
            window.Session.set("action_collection", `Creator.Collections.${object_name}`)
            window.Session.set("action_collection_name", collectionName)
        }

        const Creator = (window as any).Creator;
        if(Creator && Creator.executeAction){
            if(action.todo == "standard_delete"){
                return Creator.executeAction(object_name, action, record_id, item_element, list_view_id, record)
            }else{
                return Creator.executeAction(object_name, action, record_id, item_element)
            }
        }else{
            item_element = item_element ? item_element : "" ;
            const moreArgs = Array.prototype.slice.call(arguments, 3)
            const todoArgs = [object_name, record_id].concat(moreArgs)
            let todo = action.todo;
            if(typeof action.todo == "string"){
                return console.error(`todo must be Function`)
            }
            todo.apply({
                object_name: object_name,
                record_id: record_id,
                object: null,
                action: action,
                item_element: item_element,
                record: record
            }, todoArgs)
        }
    }
    calculationVisible(object_name, action, record, userSession){
        try {
            if(typeof action.visible == "function") {
                const Creator = (window as any).Creator;
                const userId = userSession.userId;
                const spaceId = userSession.spaceId;
                const record_permissions = Creator?.getRecordPermissions ? Creator.getRecordPermissions(object_name, record, userId, spaceId) : {};
                return action.visible(object_name, record._id, record_permissions, record);
            }else{
                return action.visible
            }
        } catch (error) {
            console.error(`calculationVisible error`, error)
        }
        return false;
    }
}