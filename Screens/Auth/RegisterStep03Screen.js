import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native'
import { Container, Content } from 'native-base'
import Header from '../Common/Header'
import AsyncStorage from '@react-native-community/async-storage'
import { useSelector, useDispatch } from 'react-redux'
import qs from 'qs'

import { setToken } from '../Module/Reducer'
import { VegasPost } from '../../utils/axios.config'

const RegisterStep03Screen = ({ navigation, route }) => {
  const title = route.params.title
  const id = route.params.id

  console.log('소셜 회원가입 단계 02에서 03으로 넘어온 props id 값: ', id)
  const fcmToken = useSelector((state) => state.Reducer.fcm_token)
  const dispatch = useDispatch()
  const [error, setError] = useState(false)

  const {
    ut_user_id,
    ut_nickname,
    ut_division,
    ut_password,
    ut_mobile,
    ut_address,
    ut_address_detail,
    social_type,
    ut_join_type,
    ut_social_id,
    ut_zipcode
  } = useSelector((state) => state.JoinReducer)

  console.log(
    '소셜 회원가입 단계03, 리덕스에서 join 회원정보로 가져온 ut_social_id 값 : ',
    ut_social_id
  )

  useEffect(() => {
    addFcm(fcmToken)
  }, [])

  const addFcm = async (fcmToken) => {
    try {
      const form = new FormData()
      form.append('fcm_token', fcmToken)
      const token = await AsyncStorage.getItem('@vegasTongToken')
      const headers = {
        authorization: token
      }
      const tokenUpdate = await VegasPost('/api/user/update_fcm_token', form, {
        headers
      })
      console.log('tokenUpdate :: ', tokenUpdate)
    } catch (e) {
      console.log(e)
    }
  }

  // 토근값 AsyncStorage에 저장
  const _storeToken = async (payload) => {
    try {
      await AsyncStorage.setItem('@vegasTongToken', payload, () => {
        console.log('token 저장 완료')
        dispatch(setToken(payload))
      })
    } catch (err) {
      console.log('erro발생 : ', err)
    }
  }

  const sendFcmToken = (payload) => {
    VegasPost(
      '/api/user/update_fcm_token',
      qs.stringify({
        fcm_token: fcmToken
      }),
      { headers: { authorization: `${payload}` } }
    )
      .then((res) => {
        if (res.result === 'success') {
          navigation.navigate('loading')
        }
        if (res.result === 'fail') {
          Alert.alert(`${res.error}`, '관리자에게 문의하세요.', [
            {
              text: '확인',
              onPress: () => {}
            }
          ])
        }
      })
      .catch((err) => console.log(err))
  };

  const onLogin = () => {
    console.log('유저 조인 타입 : ', ut_join_type)
    if (ut_join_type === 'password') {
      VegasPost(
        '/api/user/login',
        qs.stringify({
          ut_user_id: ut_user_id,
          ut_password: ut_password
        })
      )
        .then((res) => {
          console.log('Login token :', res)
          if (res.result === 'success') {
            const resToken = res.data.token
            _storeToken(resToken)
            sendFcmToken(resToken)
          } else if (res.result === 'fail') {
            if (res.error === '가입되지 않은 아이디입니다.') {
              Alert.alert(
                '가입되지 않은 아이디입니다.',
                '아이디를 확인해주세요.',
                [
                  {
                    text: '확인',
                    onPress: () => {}
                  }
                ]
              )
            } else if (res.error === '비밀번호를 잘못입력하셨습니다.') {
              Alert.alert('비밀번호가 다릅니다.', '비밀번호를 확인해주세요.', [
                {
                  text: '확인',
                  onPress: () => {}
                }
              ])
            } else {
              return false
            }
          } else {
            Alert.alert('문제가 있습니다.', '관리자에게 문의하십시요.', [
              {
                text: '확인',
                onPress: () => {}
              }
            ])
          }
        })
        .catch((e) => console.error(e))
    } else if (
      ut_join_type === 'naver' ||
      ut_join_type === 'kakao' ||
      ut_join_type === 'facebook'
    ) {
      console.log('SNS로 로그인 시도!')

      VegasPost(
        '/api/user/social_login',
        qs.stringify({
          ut_join_type,
          ut_social_id
        })
      )
        .then((res) => {
          console.log('SNS 로그인 시도 response값: ', res) // 중요 현재 테스트중!!
          if (res.result === 'success') {
            const resToken = res.data.user_info.token
            _storeToken(resToken)
            sendFcmToken(resToken)
          } else if (res.result === 'fail') {
            if (res.error === '가입되지 않은 아이디입니다.') {
              setError(res.error)
            } else if (res.error === '비밀번호를 잘못입력하셨습니다.') {
              setError(res.error)
            } else {
              return false
            }
          } else {
            Alert.alert('문제가 있습니다.', '관리자에게 문의하십시요.', [
              {
                text: '확인',
                onPress: () => {}
              }
            ])
          }
        })
        .catch((e) => console.error(e))
    } else {
      Alert.alert(
        '알수없는 접근 방식입니다.',
        '잘못된 경로로 진입하셨습니다.',
        [
          {
            text: '확인',
            onPress: () => {}
          }
        ]
      )
    }
  }

  return (
    <ScrollView>
      <Container
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: '#fff'
        }}
      >
        <Content>
          {/* 상단 헤더 */}
          <Header navigation={navigation} title={title} />

          {/* 본문 */}

          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').height - 80
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                source={require('../src/assets/img/complete_img.png')}
                resizeMode='contain'
                style={{ width: 200, height: 130, marginBottom: 30 }}
              />
              <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {ut_nickname}
                </Text>
                <Text style={{ fontSize: 24, color: '#666666' }}>
                  님 환영합니다.
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: '#666666', marginBottom: 2 }}>
                정상적으로 회원가입이 되었습니다.
              </Text>
              <Text style={{ fontSize: 16, color: '#666666', marginBottom: 5 }}>
                아래 확인을 누르시면 자동으로 로그인 됩니다.
              </Text>
            </View>

            {/* 확인 버튼 */}
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 50,
                  marginBottom: 80,
                  paddingHorizontal: 20
                }}
              >
                <TouchableOpacity activeOpacity={0.7} onPress={onLogin}>
                  <Text
                    style={{
                      backgroundColor: '#4A26F4',
                      paddingHorizontal: 80,
                      paddingVertical: 15,
                      borderRadius: 30,
                      fontSize: 18,
                      color: '#fff'
                    }}
                  >
                    확인
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Content>
      </Container>
    </ScrollView>
  )
};

export default RegisterStep03Screen
