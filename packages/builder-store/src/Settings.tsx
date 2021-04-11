import { destroy, flow, types } from 'mobx-state-tree';
import { get } from 'lodash';

const isProd = process.env.NODE_ENV === 'production';
let rootUrl = isProd ? '/' : 'http://localhost:5000';
let env: any = {};
let tenantId = '';
let userId = '';
let authToken = '';
let locale = 'zh_CN';

let config = get(window, 'steedos.setting', {});
rootUrl = config.rootUrl || rootUrl;
tenantId = config.tenantId || tenantId;
userId = config.userId || userId;
authToken = config.authToken || authToken;
locale = config.locale || locale;
env = config.env || env;



export const Settings = types
.model('Settings', {
  isProd,
  rootUrl,
  tenantId,
  userId,
  authToken,
  locale,
  env: types.frozen(),
})
.actions(self => {
    const setRootUrl = (rootUrl) => {
        self.rootUrl = rootUrl
    }
    const setTenantId = (tenantId) => {
        self.tenantId = tenantId
    }
    const setUserId = (userId) => {
        self.userId = userId
    }
    const setAuthToken = (authToken) => {
        self.authToken = authToken
    }
    const setLocale = (locale) => {
        self.locale = locale
    }

    return {
      setRootUrl,
      setTenantId,
      setUserId,
      setAuthToken,
      setLocale
    }
})
.create({
  rootUrl,
  tenantId,
  userId,
  authToken,
  locale,
  env,
});
