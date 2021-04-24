import { flow, types } from "mobx-state-tree";
import { API } from './API';

export const User = types.model({
    _id: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    avatar: types.maybeNull(types.string),
})
.actions((self) => {
    function setUserInfo(data: any, spaceId?) {
        const userId = data.userId || data._id
        self._id = userId;
        self.name = data.name;
        self.avatar = `${API.client.getUrl()}/avatar/${userId}`;

        const spaces = data.spaces;
        const cookieSpaceId = getCookie("X-Space-Id");
        if(cookieSpaceId){
            API.client.setSpaceId(cookieSpaceId);
        }else if(spaces.length > 0){
            API.client.setSpaceId(spaces[0]._id);
        }
        API.client.setUserId(userId);
        API.client.setToken(getCookie("X-Auth-Token"));
        (window as any).SClient = API.client;
    }
    function goLogin(){
        window.location.href = `/login`;
    }
    function getCookie(cname: any){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) 
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
    function delCookie(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null) document.cookie= name + "=" +cval+";expires="+ exp.toUTCString();
    }
  return {
    setUserInfo,
    goLogin,
    fetchUserInfo: flow(function* fetchUserInfo() {
        try {
            const userInfo = yield API.client.getMe();
            setUserInfo(userInfo);
        } catch (error) {
            console.error("Failed to fetch userinfo", error)
            delCookie("X-User-Id");
            goLogin();
        }
    }),
    login: flow(function* login(userName, passowrd) {
        try {
            const userInfo = yield API.client.login(userName, passowrd);
            setUserInfo(userInfo.user);
        } catch (error) {
            console.error("Failed to fetch userinfo", error)
            goLogin();
        }
    }),
    logout: flow(function* logout() {
        try {
            yield API.client.logout();
            goLogin();
        } catch (error) {
            console.error("Failed to fetch userinfo", error)
            goLogin();
        }
    }),
    afterCreate() {
        const userId = getCookie('X-User-Id');
        if(!userId){
            if(window.location.pathname.indexOf("/login") < 0){
                goLogin();
            }
        }else{
            API.client.setUserId(userId);
            API.client.setSpaceId(getCookie("X-Space-Id"));
            API.client.setToken(getCookie("X-Auth-Token"));
            (self as any).fetchUserInfo();
        }
    }
  }
}).create()