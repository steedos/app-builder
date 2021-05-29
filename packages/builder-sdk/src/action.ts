export default class Action {
    executeAction(object_name, action, record_id, item_element, list_view_id, record){
        const Creator = (window as any).Creator;
        if(Creator && Creator.executeAction){
            return Creator.executeAction(object_name, action, record_id, item_element, list_view_id, record)
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
                const record_permissions = Creator ? Creator.getRecordPermissions(object_name, record, userId, spaceId) : {}
                return action.visible(object_name, record._id, record_permissions, record)
            }else{
                return action.visible
            }
        } catch (error) {
            console.error(`calculationVisible error`, error)
        }
        return false;
    }
}