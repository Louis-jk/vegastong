// action type
const JOIN_USER_ID = 'JOIN_USER_ID';
const JOIN_USER_NICKNAME = 'JOIN_USER_NICKNAME';
const JOIN_USER_DIVISION = 'JOIN_USER_DIVISION';
const JOIN_USER_PASSWORD = 'JOIN_USER_PASSWORD';
const JOIN_USER_JOINTYPE = 'JOIN_USER_JOINTYPE';
const JOIN_USER_SOCIAL_ID = 'JOIN_USER_SOCIAL_ID';
const JOIN_USER_MOBILE = 'JOIN_USER_MOBILE';
const JOIN_USER_ZIPCODE = 'JOIN_USER_ZIPCODE';
const JOIN_USER_ADDRESS = 'JOIN_USER_ADDRESS';
const JOIN_USER_ADDRESS_DETAIL = 'JOIN_USER_ADDRESS_DETAIL';
const JOIN_USER_IMAGE = 'JOIN_USER_IMAGE';
const SOCIAL_DATA = 'SOCIAL_DATA';
const SOCIAL_TYPE = 'SOCIAL_TYPE';

// action method
export const joinUserId = (payload) => ({type: JOIN_USER_ID, payload});
export const joinUserNickname = (payload) => ({
  type: JOIN_USER_NICKNAME,
  payload,
});
export const joinUserDivision = (payload) => ({
  type: JOIN_USER_DIVISION,
  payload,
});
export const joinUserPassword = (payload) => ({
  type: JOIN_USER_PASSWORD,
  payload,
});
export const joinUserSocialId = (payload) => ({
  type: JOIN_USER_SOCIAL_ID,
  payload,
});
export const joinUserJoinType = (payload) => ({
  type: JOIN_USER_JOINTYPE,
  payload,
});
export const joinUserMobile = (payload) => ({type: JOIN_USER_MOBILE, payload});
export const joinUserZipcode = (payload) => ({
  type: JOIN_USER_ZIPCODE,
  payload,
});
export const joinUserAddress = (payload) => ({
  type: JOIN_USER_ADDRESS,
  payload,
});
export const joinUserAddressDetail = (payload) => ({
  type: JOIN_USER_ADDRESS_DETAIL,
  payload,
});
export const joinUserSocialType = (payload) => ({
  type: SOCIAL_TYPE,
  payload,
});

export const joinSocial = (payload) => ({
  type: SOCIAL_DATA,
  payload,
});

export const joinUserImage = (payload) => ({type: JOIN_USER_IMAGE, payload});

// initialize
const initialize = {
  ut_user_id: '',
  ut_nickname: '',
  ut_division: '',
  ut_password: '',
  ut_social_id: '',
  ut_join_type: '',
  ut_mobile: '',
  ut_zipcode: '',
  ut_address: '',
  ut_address_detail: '',
  ut_image: '',
  social_type: '',
  social_data: {},
};

// reducer create
export default function setJoin(state = initialize, action) {
  switch (action.type) {
    case JOIN_USER_ID:
      return {
        ...state,
        ut_user_id: action.payload,
      };
    case JOIN_USER_NICKNAME:
      return {
        ...state,
        ut_nickname: action.payload,
      };
    case JOIN_USER_DIVISION:
      return {
        ...state,
        ut_division: action.payload,
      };
    case JOIN_USER_PASSWORD:
      return {
        ...state,
        ut_password: action.payload,
      };
    case JOIN_USER_SOCIAL_ID:
      return {
        ...state,
        ut_social_id: action.payload,
      };
    case JOIN_USER_JOINTYPE:
      return {
        ...state,
        ut_join_type: action.payload,
      };
    case JOIN_USER_MOBILE:
      return {
        ...state,
        ut_mobile: action.payload,
      };
    case JOIN_USER_ZIPCODE:
      return {
        ...state,
        ut_zipcode: action.payload,
      };
    case JOIN_USER_ADDRESS:
      return {
        ...state,
        ut_address: action.payload,
      };
    case JOIN_USER_ADDRESS_DETAIL:
      return {
        ...state,
        ut_address_detail: action.payload,
      };
    case JOIN_USER_IMAGE:
      return {
        ...state,
        ut_image: action.payload,
      };
    case SOCIAL_DATA:
      return {
        ...state,
        social_data: action.payload,
      };
    case SOCIAL_TYPE:
      return {
        ...state,
        social_type: action.payload,
      };
    default:
      return state;
  }
}
