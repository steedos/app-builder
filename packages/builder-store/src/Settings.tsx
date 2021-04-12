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
  currentAppId: types.maybeNull(types.string),
  currentObjectApiName: types.maybeNull(types.string),
  currentRecordId: types.maybeNull(types.string),
  env: types.frozen(),
})
.actions(self => {
  return {
    setRootUrl: (rootUrl) => {
        self.rootUrl = rootUrl
    },
    setTenantId: (tenantId) => {
        self.tenantId = tenantId
    },
    setUserId: (userId) => {
        self.userId = userId
    },
    setAuthToken: (authToken) => {
        self.authToken = authToken
    },
    setLocale(locale){
        self.locale = locale
    },
    setCurrentObjectApiName(name: string) {
      self.currentObjectApiName = name;
    },
    setCurrentRecordId(id: string) {
      self.currentRecordId = id;
    },
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
