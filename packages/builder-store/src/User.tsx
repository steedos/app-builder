import { flow, types } from "mobx-state-tree";
import { API } from './API';
import { Settings } from "./Settings";

export const User = types.model({
  me: types.maybeNull(types.frozen()),
  isLoading: false,
  isLoginFailed: false,
})
.actions(self => {
  const setMe = (user: any) => {
    self.me = user;
  };
  const goLogin = () => {
    Settings.setUserId(null)
    Settings.setAuthToken(null)
    // window.location.href = `/login`;
  };
  const loadMe = flow(function* getMe() {
    try {
      // 临时修改：目前 /accounts/user 接口不支持传入 Authorization: Bearer ${spaceId}, #1660
      self.isLoading = true;
      API.client.setSpaceId(null);
      const me = yield API.client.getMe();
      API.client.setSpaceId(me.spaceId);
      Settings.setUserId(me._id)
      Settings.setTenantId(me.spaces[0]._id)
      setMe(me);
      self.isLoading = false;
      self.isLoginFailed = false
      return me;
    } catch (error) {
      self.isLoading = false;
      self.isLoginFailed = true
      setMe(null)
      console.error("Failed to fetch userinfo", error)
      return null;
    }
  });
  const getMe = () => {
    if (!self.me && !self.isLoginFailed)
      loadMe();
    return self.me
  }
  return {
    getMe, 
    login: flow(function* login(userInput, passowrd) {
      self.isLoading = true;
      let email = '';
      let mobile = '';
      let username = '';
      if (userInput) {
          if (userInput.indexOf('@') > 0) {
              email = userInput;
          } else if (userInput.length === 11 && new Number(userInput) > 10000000000) {
              mobile = userInput;
          } else {
              username = userInput;
          }
      }

      const user = { email: email, mobile: mobile, username: username, spaceId: "" }

      try {
          const data = yield API.client.login(user, passowrd);
          if (data.user) {
            setMe(data.user);
            API.client.setUserId(data.user._id);
            API.client.setToken(data.token);
            API.client.setSpaceId(data.user.spaceId);
            Settings.setUserId(data.user._id)
            Settings.setAuthToken(data.token)
            Settings.setTenantId(data.user.spaceId)
            self.isLoading = false;
            self.isLoginFailed = false
          }
          return data
      } catch (error) {
        self.isLoading = false;
        self.isLoginFailed = true
        console.error("Failed to fetch userinfo", error)
        goLogin();
      }
    }),
    logout: flow(function* logout() {
        try {
            yield API.client.logout();
            Settings.setUserId(null)
            Settings.setAuthToken(null)
            Settings.setTenantId(null)
            goLogin();
        } catch (error) {
            console.error("Failed to fetch userinfo", error)
            goLogin();
        }
    }),
    afterCreate() {
      
    }
  }
}).create()