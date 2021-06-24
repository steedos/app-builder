import { find } from 'lodash';
export default class ListView {
    find(listviews, key){
        const listview = listviews[key] ? listviews[key] : find(listviews, (item)=>{return item._id === key || item.name === key});
        if(listview){
            return listview;
        }else{
            if(window.Creator){
                return window.Creator.getCollection("object_listviews").findOne(key)
            }
        }
    }
}