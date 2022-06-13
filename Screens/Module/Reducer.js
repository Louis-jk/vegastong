// action type
const SET_TOKEN = 'SET_TOKEN';
const DELETE_TOKEN = 'DELETE_TOKEN';
const KEYWORD = 'KEYWORD';
const TAG = 'TAG';
const FCM_TOKEN = 'FCM_TOKEN';
const SET_DRAWER = 'SET_DRAWER';
const SET_SCRAPS = 'SET_SCRAPS';
const REMOVE_SCRAPS = 'REMOVE_SCRAPS';

// action method
export const setToken = (payload) => ({type: SET_TOKEN, payload});
export const delToken = (payload) => ({type: DELETE_TOKEN, payload});
export const setKeyword = (payload) => ({type: KEYWORD, payload});
export const setTag = (payload) => ({type: TAG, payload});
export const setFcmToken = (payload) => ({type: FCM_TOKEN, payload});
export const setDrawer = (payload) => ({type: SET_DRAWER, payload});
export const setScraps = (payload) => ({type: SET_SCRAPS, payload});
export const removeScraps = (payload) => ({type: REMOVE_SCRAPS, payload});

// initialize
const initialize = {
  token: null,
  keyword: '',
  tag: null,
  fcm_token: null,
  isDrawer: false,
  scraps: [],
};

// reducer create
export default function setStore(state = initialize, action) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case DELETE_TOKEN:
      return {
        ...state,
        token: state.token.filter((t) => t !== action.payload),
      };
    case KEYWORD:
      return {
        ...state,
        keyword: action.payload,
      };
    case TAG:
      return {
        ...state,
        tag: action.payload,
      };
    case FCM_TOKEN:
      return {
        ...state,
        fcm_token: action.payload,
      };
    case SET_DRAWER:
      return {
        ...state,
        isDrawer: action.payload,
      };
    case SET_SCRAPS:
      return {
        ...state,
        scraps: state.scraps.concat(action.payload),
      };
    case REMOVE_SCRAPS:
      return {
        ...state,
        scraps: state.scraps.filter((s) => s.sc_id != action.payload),
      };
    default:
      return state;
  }
}
