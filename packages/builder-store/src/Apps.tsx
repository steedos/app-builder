import { flow, types } from "mobx-state-tree";
import { API } from './API';
import _ from 'lodash';

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
}).actions((self) => {
    function setAppsMenus(menus) {
        _.each(menus, function(menu){
            self.menus.put(menu);
        })
    }
    const loadAppsMenus = flow(function* loadAppsMenus() {
        try {
            const menus = yield API.client.doFetch(API.client.getUrl() + `/service/api/apps/menus`, { method: 'get' });
            setAppsMenus(menus);
        } catch (error) {
            console.error("Failed to fetch apps/menus", error)
        }
    })
    return {
        getMenus: function () {
            if (self.menus && self.menus.size) {
                return self.menus;
            } else {
                loadAppsMenus();
                return self.menus;
            }
        },
        changeCurrentApp: function(appId){
            self.currentAppId = appId;
        },
        getCurrentApp: function(appId){
            let app = self.menus.get(appId);
            if(!app){
                if(self.menus.size > 0){
                    app = self.menus.get(appId);
                    if(!app){
                        app = self.menus.get(_.keys(self.menus.toJSON())[0]);
                    }
                  }
            }
            if(app){
                self.currentAppId = app.id;
            }
            return app;
        },
    }
}).create()
