import { getCookie } from './cookie';

export const getUserId = () => {
    return getCookie("X-User-Id");
}

export const getAuthToken = () => {
    return getCookie("X-Auth-Token");
}

export const getSpaceId = () => {
    return getCookie("X-Space-Id");
}