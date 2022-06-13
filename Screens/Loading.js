import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import qs from 'qs';
import axios from 'axios';
import {userInfo} from './Module/UserInfoReducer';
import firebase from '@react-native-firebase/app';
import iid from '@react-native-firebase/iid';
import messaging from '@react-native-firebase/messaging';
import {CommonActions} from '@react-navigation/native';
import {
  userInfoId,
  userInfoUserId,
  userInfoNickname,
  userInfoDivision,
  userInfoJoinType,
  userInfoSocialId,
  userInfoPassword,
  userInfoMobile,
  userInfoZipcode,
  userInfoAddress,
  userInfoAddressDetail,
  userInfoImage,
  userInfoCreatedAt,
  userInfoUpdatedAt,
  userInfoFcmToken,
} from './Module/UserInfoReducer';

const baseUrl = 'https://dmonster1826.cafe24.com';

const Loading = (props) => {
  // Redux 연결
  const token = useSelector((state) => state.Reducer.token);
  const fcmToken = useSelector((state) => state.Reducer.fcm_token);
  const dispatch = useDispatch();
  const navigation = props.navigation;

  //resetStack

  const resetStack = (nav) => {
    return props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: nav}],
      }),
    );
  };

  // Loading 화면
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (!token) {
      // props.navigation.navigate('login');
      resetStack('login');
      setLoading(false);
    } else if (token !== null) {
      // 토큰 값이 있을 경우 유저 정보 리덕스에 저장
      axios({
        method: 'post',
        url: `${baseUrl}/api/user/myinfo`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          authorization: token,
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
      })
        .then((res) => {
          if (res.data.result === 'success') {
            dispatch(userInfoId(res.data.data.ut_id));
            dispatch(userInfoUserId(res.data.data.ut_user_id));
            dispatch(userInfoNickname(res.data.data.ut_nickname));
            dispatch(userInfoDivision(res.data.data.ut_division));
            dispatch(userInfoJoinType(res.data.data.ut_join_type));
            dispatch(userInfoSocialId(res.data.data.ut_social_id));
            dispatch(userInfoPassword(res.data.data.ut_password));
            dispatch(userInfoMobile(res.data.data.ut_mobile));
            dispatch(userInfoZipcode(res.data.data.ut_zipcode));
            dispatch(userInfoAddress(res.data.data.ut_address));
            dispatch(userInfoAddressDetail(res.data.data.ut_address_detail));
            dispatch(userInfoImage(res.data.data.ut_image));
            dispatch(userInfoCreatedAt(res.data.data.ut_created_at));
            dispatch(userInfoUpdatedAt(res.data.data.ut_updated_at));
            dispatch(userInfoFcmToken(res.data.data.ut_fcm_token));
          } else {
            navigation.navigate('login');
          }
        })
        .catch((err) => console.error(err));

      // firebase 푸쉬 관련 토큰 전송
      axios({
        method: 'get',
        url: `${baseUrl}/api/common/log_user_login`,
        headers: {
          authorization: token,
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
      })
        .then((res) => {
          if (res.data.result === 'success') {
            return;
          }
        })
        .catch((err) => console.log(err));
      resetStack('home');
      //props.navigation.navigate('home');
      setLoading(false);
    }
  }, [token]);

  async function Auth_App() {
    try {
      const id = await iid().get();
      console.log('Current Instance ID: ', id);
      const f_token = await firebase.iid().getToken();
      console.log('f_token: ', f_token);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    Auth_App();
    resetStack('home');
    // props.navigation.navigate('home');
  }, []);

  return (
    <View>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>test Loading</Text>
        </View>
      ) : null}
    </View>
  );
};

export default Loading;
