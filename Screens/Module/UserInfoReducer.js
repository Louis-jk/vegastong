// action type
const USER_INFO = 'USER_INFO';
const USER_INFO_ID = 'USER_INFO_ID';
const USER_INFO_USER_ID = 'USER_INFO_USER_ID';
const USER_INFO_NICKNAME = 'USER_INFO_NICKNAME';
const USER_INFO_DIVISION = 'USER_INFO_DIVISION';
const USER_INFO_JOINTYPE = 'USER_INFO_JOINTYPE';
const USER_INFO_SOCIAL_ID = 'USER_INFO_SOCIAL_ID';
const USER_INFO_PASSWORD = 'USER_INFO_PASSWORD';
const USER_INFO_MOBILE = 'USER_INFO_MOBILE';
const USER_INFO_ZIPCODE = 'USER_INFO_ZIPCODE';
const USER_INFO_ADDRESS = 'USER_INFO_ADDRESS';
const USER_INFO_ADDRESS_DETAIL = 'USER_INFO_ADDRESS_DETAIL';
const USER_INFO_IMAGE = 'USER_INFO_IMAGE ';
const USER_INFO_CREATED_AT = 'USER_INFO_CREATED_AT';
const USER_INFO_UPDATED_AT = 'USER_INFO_UPDATED_AT';
const USER_INFO_FCM_TOKEN = 'USER_INFO_FCM_TOKEN';

// action method
export const userInfo = (payload) => ({
  type: USER_INFO,
  payload,
});
export const userInfoId = (payload) => ({type: USER_INFO_ID, payload});
export const userInfoUserId = (payload) => ({type: USER_INFO_USER_ID, payload});
export const userInfoNickname = (payload) => ({
  type: USER_INFO_NICKNAME,
  payload,
});
export const userInfoDivision = (payload) => ({
  type: USER_INFO_DIVISION,
  payload,
});
export const userInfoJoinType = (payload) => ({
  type: USER_INFO_JOINTYPE,
  payload,
});
export const userInfoSocialId = (payload) => ({
  type: USER_INFO_SOCIAL_ID,
  payload,
});
export const userInfoPassword = (payload) => ({
  type: USER_INFO_PASSWORD,
  payload,
});
export const userInfoMobile = (payload) => ({type: USER_INFO_MOBILE, payload});
export const userInfoZipcode = (payload) => ({
  type: USER_INFO_ZIPCODE,
  payload,
});
export const userInfoAddress = (payload) => ({
  type: USER_INFO_ADDRESS,
  payload,
});
export const userInfoAddressDetail = (payload) => ({
  type: USER_INFO_ADDRESS_DETAIL,
  payload,
});
export const userInfoImage = (payload) => ({type: USER_INFO_IMAGE, payload});
export const userInfoCreatedAt = (payload) => ({
  type: USER_INFO_CREATED_AT,
  payload,
});
export const userInfoUpdatedAt = (payload) => ({
  type: USER_INFO_UPDATED_AT,
  payload,
});
export const userInfoFcmToken = (payload) => ({
  type: USER_INFO_FCM_TOKEN,
  payload,
});

// initialize
const initialize = {
  user_info: '',
  ut_id: '',
  ut_user_id: '',
  ut_nickname: '',
  ut_division: '',
  ut_join_type: '',
  ut_social_id: '',
  ut_password: '',
  ut_mobile: '',
  ut_zipcode: '',
  ut_address: '',
  ut_address_detail: '',
  ut_image: '',
  ut_created_at: '',
  ut_updated_at: '',
  ut_fcm_token: '',
};

// reducer create
export default function setUserInfo(state = initialize, action) {
  switch (action.type) {
    case USER_INFO:
      return {
        ...state,
        user_info: action.payload,
      };
    case USER_INFO_ID:
      return {
        ...state,
        ut_id: action.payload,
      };
    case USER_INFO_USER_ID:
      return {
        ...state,
        ut_user_id: action.payload,
      };
    case USER_INFO_NICKNAME:
      return {
        ...state,
        ut_nickname: action.payload,
      };
    case USER_INFO_DIVISION:
      return {
        ...state,
        ut_division: action.payload,
      };
    case USER_INFO_JOINTYPE:
      return {
        ...state,
        ut_join_type: action.payload,
      };
    case USER_INFO_PASSWORD:
      return {
        ...state,
        ut_password: action.payload,
      };
    case USER_INFO_SOCIAL_ID:
      return {
        ...state,
        ut_social_id: action.payload,
      };
    case USER_INFO_MOBILE:
      return {
        ...state,
        ut_mobile: action.payload,
      };
    case USER_INFO_ZIPCODE:
      return {
        ...state,
        ut_zipcode: action.payload,
      };
    case USER_INFO_ADDRESS:
      return {
        ...state,
        ut_address: action.payload,
      };
    case USER_INFO_ADDRESS_DETAIL:
      return {
        ...state,
        ut_address_detail: action.payload,
      };
    case USER_INFO_IMAGE:
      return {
        ...state,
        ut_image: action.payload,
      };
    case USER_INFO_CREATED_AT:
      return {
        ...state,
        ut_created_at: action.payload,
      };
    case USER_INFO_UPDATED_AT:
      return {
        ...state,
        ut_updated_at: action.payload,
      };
    case USER_INFO_FCM_TOKEN:
      return {
        ...state,
        ut_fcm_token: action.payload,
      };
    default:
      return state;
  }
}
