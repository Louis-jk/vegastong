import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { VegasPost, VegasGet } from '../utils/axios.config'
import {
  userInfo,
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
  userInfoFcmToken
} from './Module/UserInfoReducer'
import firebase from '@react-native-firebase/app'
import iid from '@react-native-firebase/iid'
import messaging from '@react-native-firebase/messaging'
import { CommonActions } from '@react-navigation/native'

const Loading = (props) => {
  // Redux 연결
  const token = useSelector((state) => state.Reducer.token)
  const dispatch = useDispatch()
  const navigation = props.navigation

  const resetStack = (nav) => {
    return props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: nav }]
      })
    )
  };

  // Loading 화면
  const [isLoading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setLoading(true)
    if (!token) {
      // props.navigation.navigate('login');
      resetStack('login')
      setLoading(false)
    } else if (token !== null) {
      // 토큰 값이 있을 경우 유저 정보 리덕스에 저장

      VegasPost('/api/user/myinfo', {}, { headers: { authorization: `${token}` } })
        .then((res) => {
          if (res.result === 'success') {
            dispatch(userInfoId(res.data.ut_id))
            dispatch(userInfoUserId(res.data.ut_user_id))
            dispatch(userInfoNickname(res.data.ut_nickname))
            dispatch(userInfoDivision(res.data.ut_division))
            dispatch(userInfoJoinType(res.data.ut_join_type))
            dispatch(userInfoSocialId(res.data.ut_social_id))
            dispatch(userInfoPassword(res.data.ut_password))
            dispatch(userInfoMobile(res.data.ut_mobile))
            dispatch(userInfoZipcode(res.data.ut_zipcode))
            dispatch(userInfoAddress(res.data.ut_address))
            dispatch(userInfoAddressDetail(res.data.ut_address_detail))
            dispatch(userInfoImage(res.data.ut_image))
            dispatch(userInfoCreatedAt(res.data.ut_created_at))
            dispatch(userInfoUpdatedAt(res.data.ut_updated_at))
            dispatch(userInfoFcmToken(res.data.ut_fcm_token))
          } else {
            navigation.navigate('login')
          }
        })
        .catch((err) => console.error(err))

      // firebase 푸쉬 관련 토큰 전송
      VegasGet('/api/common/log_user_login', {
        headers: { authorization: `${token}` }
      })
        .then((res) => {
          if (res.result === 'success') {
          }
        })
        .catch((err) => console.log(err))
      resetStack('home')
      setLoading(false)
    }
  }, [token])

  async function AuthApp () {
    try {
      const id = await iid().get()
      console.log('Current Instance ID: ', id)
      const fcmToken = await firebase.iid().getToken()
      console.log('fcmToken: ', fcmToken)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    AuthApp()
    resetStack('home')
  }, [])

  return (
    <View>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>test Loading</Text>
        </View>
      ) : null}
    </View>
  )
};

export default Loading
