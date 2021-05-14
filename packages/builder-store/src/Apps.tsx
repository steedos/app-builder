import { flow, types } from "mobx-state-tree";
import { API } from './API';
import { each, keys} from 'lodash';

export const AppMenuModel = types.model({
    id: types.identifier,
    name: types.maybeNull(types.string),
    path: types.maybeNull(types.string),
    icon: types.maybeNull(types.string),
    target: types.maybeNull(types.string),
    description: types.maybeNull(types.string),
    children: types.frozen()
})

export const Apps = types.model({
    menus: types.optional(types.map(AppMenuModel), {}),
    currentAppId: types.maybeNull(types.string),
    currentApp: types.maybeNull(AppMenuModel),
}).actions((self) => {
    const loadMenus = flow(function* loadMenus() {
        try {
            const menus = yield API.client.doFetch(API.client.getUrl() + `/service/api/apps/menus`, { method: 'get' });
            setMenus(menus);
            return self.menus;
        } catch (error) {
            console.error("Failed to fetch apps/menus", error)
        }
    })
    function setMenus(menus) {
        each(menus, function(menu){
            self.menus.put(menu);
        })
    }
    const getMenus = function () {
        if (self.menus && self.menus.size) {
            return self.menus;
        } else {
            const menus = loadMenus();
            return self.menus;
        }
    }
    const getCurrentApp = function(){
        const menus = getMenus();
        let app = menus.get(self.currentAppId);
        if(!app){
            if(menus.size > 0){
                app = menus.get(self.currentAppId);
                if(!app){
                    app = menus.get(keys(menus.toJSON())[0]);
                }
              }
        }
        return app;
    }
    return {
        getMenus,
        getCurrentApp,
        setCurrentAppId: function(appId){
            self.currentAppId = appId;
            // self.currentApp = getCurrentApp(self.currentAppId)
        },
    }
}).create()
