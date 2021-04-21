import { flow, types } from "mobx-state-tree";
import { API } from './API';

export const User = types.model({
    _id: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    avatar: types.maybeNull(types.string),
})
.actions((self) => {
    function setUserInfo(data: any) {
        self._id = data._id;
        self.name = data.name;
        self.avatar = data.avatar;
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
            setUserInfo(userInfo);
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
            (self as any).fetchUserInfo();
        }
    }
  }
}).create()