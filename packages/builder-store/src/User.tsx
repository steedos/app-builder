import { flow, types } from "mobx-state-tree";
import { API } from './API';
import { Settings } from "./Settings";

export const User = types.model({
    user: types.maybeNull(types.frozen()),
})
.actions(self => {
  const setUser = (user: any) => {
    self.user = user;
  };
  const goLogin = () => {
    Settings.setUserId(null)
    Settings.setAuthToken(null)
    // window.location.href = `/login`;
  };
  const getMe = flow(function* getMe() {
      try {
          const userInfo = yield API.client.getMe();
          setUser(userInfo);
      } catch (error) {
          console.error("Failed to fetch userinfo", error)
          goLogin();
      }
  });
  return {
    getMe, 
    login: flow(function* login(userInput, passowrd) {
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
            setUser(data.user);
            Settings.setUserId(data.user._id)
            Settings.setAuthToken(data.token)
            Settings.setTenantId(data.user.spaceId)
          }
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
      if (Settings.userId && Settings.authToken) {
        getMe();
      } else {
        goLogin();
      }
    }
  }
}).create()