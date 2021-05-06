import { destroy, flow, types } from 'mobx-state-tree';
import { get } from 'lodash';

const isProd = process.env.NODE_ENV === 'production';
let rootUrl = isProd ? '/' : process.env.REACT_APP_API_URL? process.env.REACT_APP_API_URL: 'http://localhost:5000';
let env: any = process.env;
let tenantId = localStorage.getItem('steedos:spaceId');
let userId = localStorage.getItem('steedos:userId');
let authToken = localStorage.getItem('steedos:token');
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
  tenantId: types.maybeNull(types.string),
  userId: types.maybeNull(types.string),
  authToken: types.maybeNull(types.string),
  locale: types.maybeNull(types.string),
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
        if (tenantId)
          localStorage.setItem('steedos:spaceId', tenantId);
        else 
          localStorage.removeItem('steedos:spaceId')
    },
    setUserId: (userId) => {
        self.userId = userId
        if (userId)
          localStorage.setItem('steedos:userId', userId);
          else 
            localStorage.removeItem('steedos:userId')
    },
    setAuthToken: (authToken) => {
        self.authToken = authToken
        if (authToken)
          localStorage.setItem('steedos:token', authToken);
        else 
          localStorage.removeItem('steedos:token')
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

