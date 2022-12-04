const BASE_URL = 'http://localhost:8080';

export const API = {
  LOGIN: `${BASE_URL}/api/auth/signin`,
  LOGOUT: `${BASE_URL}/api/auth/logout`,
  SIGNUP: `${BASE_URL}/api/auth/signup`,
  GET_PAGE: `${BASE_URL}/api/page/`,
  UPDATE_PAGE: `${BASE_URL}/api/page/edit`,
  ADD_PAGE: `${BASE_URL}/api/page/addpage`,
  DELETE_PAGE: `${BASE_URL}/api/page/delete/`,
  GET_PAGE_LIST: `${BASE_URL}/api/page/list/`,
  ADD_WORKSPACE: `${BASE_URL}/api/workspace/addworkspace`,
  ADD_WORKSPACE_MEMBER: `${BASE_URL}/api/workspace/invite`,
  RENAME_WORKSPACE: `${BASE_URL}/api/workspace/rename`,
  GET_USER_NICKNAME: `${BASE_URL}/api/user/`,
};
