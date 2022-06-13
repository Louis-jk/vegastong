import {combineReducers} from 'redux';
import Reducer from './Reducer';
import JoinReducer from './JoinReducer';
import UserInfoReducer from './UserInfoReducer';

const rootReducer = combineReducers({
  Reducer,
  JoinReducer,
  UserInfoReducer,
});

export default rootReducer;
