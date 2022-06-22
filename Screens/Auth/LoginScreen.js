import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
  BackHandler
} from 'react-native'

import { Container, Content, Form, Item, Input } from 'native-base'
import qs from 'qs'
import AsyncStorage from '@react-native-community/async-storage'
import { useSelector, useDispatch } from 'react-redux'
import { setToken } from '../Module/Reducer'
import KakaoLogins, { KAKAO_AUTH_TYPES } from '@react-native-seoul/kakao-login'
// import {NaverLogin, getProfile} from '@react-native-seoul/naver-login';
import messaging from '@react-native-firebase/messaging'
import Config from 'react-native-config'
import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager
} from 'react-native-fbsdk'

import { VegasPost } from '../../utils/axios.config'

// Redux
import { setFcmToken } from '../Module/Reducer'

const BASE_URL = Config.BASE_URL

const logCallback = (log, callback, move) => {
  console.log(log)
  callback;
  move
};

const N_iosKeys = {
  kConsumerKey: 'VC5CPfjRigclJV_TFACU',
  kConsumerSecret: 'f7tLFw0AHn',
  kServiceAppName: '테스트앱(iOS)',
  kServiceAppUrlScheme: 'testapp' // only for iOS
}

const N_androidKeys = {
  kConsumerKey: '1HEogbkOFIk8neFBOQOy',
  kConsumerSecret: '3xixH22ZEX',
  kServiceAppName: '베가스통'
}

const SOCIAL_CHECK = BASE_URL + '/api/user/social_login'

const initials = Platform.OS === 'ios' ? N_iosKeys : N_androidKeys

const LoginScreen = (props) => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.Reducer.token)
  const fcmToken = useSelector((state) => state.Reducer.fcm_token)

  const navigation = props.navigation

  const [userId, inputUserId] = useState('')
  const [userPw, inputUserPw] = useState('')
  const pwRef = useRef()

  const [error, setError] = useState('')
  const [pwLengthError, setPwLengthError] = useState(false)
  const [exeption, setExeption] = useState('')

  const [kakaoLoginLoading, setKakaoLoginLoading] = useState(false)
  const [naverToken, setNaverToken] = React.useState(null)

  useEffect(() => {
    const backAction = () => {
      console.log('Login canGoBack', navigation.canGoBack())
      const cangBack = navigation.canGoBack()

      if (!cangBack) {
        Alert.alert('앱 종료', '앱을 종료하시겠습니까?', [
          {
            text: '취소',
            onPress: () => null,
            style: 'cancel'
          },
          { text: '확인', onPress: () => BackHandler.exitApp() }
        ])
        return true
      } else {
        return false
      }
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

  const socialCheckApi = async (type, id) => {
    const form = new FormData()
    form.append('ut_join_type', type)
    form.append('ut_social_id', id)
    try {
      const check = await VegasPost(SOCIAL_CHECK, form, {
        headers: {
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U'
        }
      })

      const join_data = {
        type: type,
        id: id,
        title: 'SNS 추가정보 입력'
      }
      console.log('카톡 체크 데이타 result : ', check)
      if (check.data.result === 'fail') {
        const join_data_update = {
          type: type,
          id: id,
          title: 'SNS 추가정보 입력',
          reg_route: 'reReg'
        }
        Alert.alert(`${check.data.error}`, '재가입하시겠습니까?', [
          {
            text: '재가입하기',
            onPress: () =>
              navigation.navigate('register_social', join_data_update)
          },
          {
            text: '취소',
            onPress: () => {}
          }
        ])
      }
      if (check.data.result === 'success') {
        if (check.data.data.login) {
          await socialLoginPass(check)
        } else {
          navigation.navigate('register_social', join_data)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const socialLoginPass = async (data) => {
    const user = data.data.data.user_info
    console.log('kato user : ', user)
    const token = user.token
    let form = new FormData()
    form.append('fcm_token', fcmToken)
    // const headers = {
    //   authorization: token,
    //   'api-secret':
    //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U'
    // }

    const sendData = {
      fcm_token: fcmToken
    }

    const tokenUpdate = await VegasPost(
      '/api/user/update_fcm_token',
      qs.stringify(sendData),
      {
        headers: { authorization: `${token}` }
      }
    )

    console.log('tokenUpdate ??', tokenUpdate)

    if (tokenUpdate.data.result === 'success') {
      _storeToken(token)
      Alert.alert('베가스통', `${user.user.ut_nickname}님 환영합니다.`, [
        { text: '확인', onPress: () => {} }
      ])
      navigation.navigate('loading')
    }
  }

  const kakaoLogin = async () => {
    logCallback('Login start', setKakaoLoginLoading(true))
    try {
      const kakao_login_process = await KakaoLogins.login([
        KAKAO_AUTH_TYPES.Talk,
        KAKAO_AUTH_TYPES.Account
      ])
      const kakao_profile = await kakao_getProfile()

      console.log('proce', kakao_login_process)
      console.log('profile', kakao_profile)
      logCallback('Login success', setKakaoLoginLoading(true))

      await socialCheckApi('kakao', kakao_profile.id) //  카카오
    } catch (e) {
      if (e.code === 'E_CANCELLED_OPERATION') {
        logCallback(
          `Login Cancelled:${e.message}`,
          setKakaoLoginLoading(false)
        )
      } else {
        logCallback(`Login Failed:${e.message}`, setKakaoLoginLoading(false))
      }
    }
  }

  const kakao_getProfile = async () => {
    logCallback('getProfile', setKakaoLoginLoading(true))
    try {
      const kakao_profile = await KakaoLogins.getProfile()

      logCallback('getProfileFinished', setKakaoLoginLoading(false))
      return kakao_profile
    } catch (e) {
      logCallback('getFailed', setKakaoLoginLoading(false))
    }
  }

  // const naverLogin = async (init) => {
  //   try {
  //     await NaverLogin.login(init, async (err, token) => {
  //       console.log('N_token', token);
  //       const N_user = await N_UserProfile(token.accessToken);
  //       console.log('N_user', N_user);

  //       if (N_user.message === 'success') {
  //         await socialCheckApi('naver', N_user.response.id); //  네이버
  //       }
  //     });
  //   } catch (e) {
  //     console.log('네이버 로그인 에러 : ', e);
  //   }
  // };

  // const N_UserProfile = async (token) => {
  //   const profileResult = await getProfile(token);
  //   if (profileResult.resultcode === '024') {
  //     Alert.alert('로그인 실패', profileResult.message);
  //     return;
  //   }
  //   return profileResult;
  // };

  const faceBookLogin = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        console.log(result)
        if (result.isCancelled) {
          console.log('Login cancelled')
        } else {
          getPublicProfile()

          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString()
          )
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error)
      }
    )
  };

  const getPublicProfile = async () => {
    const infoRequest = new GraphRequest(
      '/me?fields=id,name,email,picture',
      null,
      async (error, result) => {
        if (error) {
          console.log('Error fetching data: ' + error.toString())
        } else {
          console.log(result)
          await socialCheckApi('facebook', result.id) //  카카오
        }
      }
    )

    new GraphRequestManager().addRequest(infoRequest).start()
  };

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
    console.log('Login fcmToken : ', fcmToken)
    console.log('Login sendFcmToken before Token value : ', payload)

    const formdata = new FormData()
    formdata.append('fcm_token', fcmToken)

    VegasPost(
      '/api/user/update_fcm_token',
      qs.stringify({
        fcm_token: payload
      }),
      {
        headers: { authorization: `${payload}` }
      }
    )
      .then((res) => {
        console.log('sendFcmToken res ?', res)
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

  const onSubmit = () => {
    if (userPw.length < 4) {
      setPwLengthError(true)
    } else {
      messaging()
        .getToken()
        .then((fToken) => {
          console.log('App token : ', fToken)
          dispatch(setFcmToken(fToken))
          // setStateFcmToken(fToken);
        })

      VegasPost(
        '/api/user/login',
        qs.stringify({
          ut_user_id: userId,
          ut_password: userPw
        })
      )
        .then((res) => {
          console.log('Login token :', res)
          if (res.result === 'fail') {
            Alert.alert(`${res.error}`, '재가입하시겠습니까?', [
              {
                text: '재가입하기',
                onPress: () =>
                  navigation.navigate('register_step01', { reg_route: 'reReg' })
              },
              {
                text: '취소',
                onPress: () => {}
              }
            ])
          }
          if (res.result === 'success') {
            const resToken = res.data.token
            _storeToken(resToken)
            sendFcmToken(resToken)
          }
          if (res.result === 'fail') {
            if (res.error === '가입되지 않은 아이디입니다.') {
              setError(res.error)
            } else if (res.error === '비밀번호를 잘못입력하셨습니다.') {
              setError(res.error)
            } else {
              return false
            }
          } else {
            setExeption(res.error)
          }
        })
        .catch((e) => console.error(e))
    }
  }

  useEffect(() => {
    messaging()
      .getToken()
      .then((fToken) => {
        console.log('App token : ', fToken)
        dispatch(setFcmToken(fToken))
      })
  }, [])

  return (
    <Container style={{ backgroundColor: '#EAEAEA' }}>
      <Content>
        <ImageBackground
          source={require('../src/assets/img/log_bg_gra.png')}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
          }}
        >
          <View
            style={{
              position: 'relative',
              height: 270,
              paddingTop: 70,
              paddingHorizontal: 20
            }}
          >
            <View
              style={{
                position: 'absolute',
                bottom: -10,
                right: 0
              }}
            >
              <Image
                source={require('../src/assets/img/log_bg.png')}
                resizeMode='cover'
                style={{
                  width: Dimensions.get('window').width,
                  height: 230
                }}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                source={require('../src/assets/img/log_logo.png')}
                resizeMode='contain'
                style={{
                  width: Dimensions.get('window').width * 0.6,
                  height: Dimensions.get('window').width * 0.65
                }}
              />
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: 20
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: 25,
                paddingHorizontal: 20
              }}
            >
              <Form style={{ paddingTop: 35 }}>
                <Item style={{ marginLeft: 0, marginBottom: 10 }}>
                  <Image
                    source={require('../src/assets/img/ic_login.png')}
                    resizeMode='contain'
                    style={{ width: 30, height: 30 }}
                  />

                  <Input
                    placeholder='아이디'
                    placeholderTextColor='#E3E3E3'
                    name='userId'
                    onChangeText={(text) => inputUserId(text)}
                    value={userId}
                    autoCapitalize='none'
                    returnKeyLabel='다음'
                    returnKeyType='next'
                    onSubmitEditing={() => pwRef.current._root.focus()}
                  />
                </Item>
                {error == '가입되지 않은 아이디입니다.' ? (
                  <View style={{ marginVertical: 10 }}>
                    <Text style={{ color: 'red' }}>
                      가입되지 않은 아이디입니다.
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
                <Item style={{ marginLeft: 0 }}>
                  <Image
                    source={require('../src/assets/img/log_ic02.png')}
                    resizeMode='contain'
                    style={{ width: 30, height: 30 }}
                  />
                  <Input
                    ref={pwRef}
                    placeholder='비밀번호'
                    secureTextEntry
                    placeholderTextColor='#E3E3E3'
                    name='userPw'
                    onChangeText={(text) => inputUserPw(text)}
                    value={userPw}
                    autoCapitalize='none'
                    returnKeyLabel='로그인'
                    returnKeyType='done'
                    onSubmitEditing={onSubmit}
                  />
                </Item>
                {pwLengthError ? (
                  <View style={{ marginVertical: 10 }}>
                    <Text style={{ color: 'red' }}>
                      비밀번호는 4자리 이상이어야 합니다.
                    </Text>
                  </View>
                ) : null}
                {error == '비밀번호를 잘못입력하셨습니다.' ? (
                  <View style={{ marginVertical: 10 }}>
                    <Text style={{ color: 'red' }}>
                      비밀번호를 잘못 입력하셨습니다.
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
              </Form>
              {/* 수정하기 버튼 */}
              <View
                style={{
                  marginTop: 20
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onSubmit}
                  style={{
                    width: '100%',
                    backgroundColor: '#4A26F4',
                    borderRadius: 25
                  }}
                >
                  <Text
                    style={{
                      paddingVertical: 15,
                      textAlign: 'center',
                      fontSize: 18,
                      color: '#fff'
                    }}
                  >
                    로그인
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10
                }}
              >
                <TouchableOpacity
                  onPress={
                    () =>
                      Alert.alert(
                        '현재 기능이 아직 개발중인 기능입니다.',
                        '고객센터에 문의해주세요.',
                        [
                          {
                            text: '확인'
                            // onPress: () => navigation.navigate('login')
                          },
                          {
                            text: '취소'
                          }
                        ]
                      )
                    // navigation.navigate('FinderId', {
                    //   title: '아이디 찾기',
                    // })
                  }
                  style={{ padding: 10 }}
                >
                  <Text style={{ fontSize: 16, color: '#999' }}>아이디 찾기</Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: 20,
                    width: 1,
                    backgroundColor: '#eee',
                    marginHorizontal: 2
                  }}
                />
                <TouchableOpacity
                  onPress={
                    () =>
                      Alert.alert(
                        '현재 기능이 아직 개발중인 기능입니다.',
                        '고객센터에 문의해주세요.',
                        [
                          {
                            text: '확인'
                            // onPress: () => navigation.navigate('login')
                          },
                          {
                            text: '취소'
                          }
                        ]
                      )
                    // navigation.navigate('FinderPassword', {
                    //   title: '비밀번호 초기화'
                    // })
                  }
                  style={{ padding: 10 }}
                >
                  <Text style={{ fontSize: 16, color: '#999' }}>
                    비밀번호 찾기
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: 20,
                    width: 1,
                    backgroundColor: '#eee',
                    marginHorizontal: 2
                  }}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    navigation.navigate('register_step01', { title: '회원가입' })}
                  style={{ padding: 10 }}
                >
                  <Text style={{ fontSize: 16, color: '#999' }}>회원가입</Text>
                </TouchableOpacity>
              </View>
              {/* <View style={{ marginTop: 15, marginBottom: 10 }}>
              <Text style={{ textAlign: 'center', fontSize: 18 }}>
                SNS 계정으로 로그인
              </Text>
            </View> */}
              {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 30,
              }}>
              <TouchableOpacity>
                <Image
                  source={require('../src/assets/img/sns_01.png')}
                  resizeMode="cover"
                  style={{width: 70, height: 70, borderRadius: 70}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                // onPress ={()=>navigation.navigate('register_social', {title:'소셜로그인'})}>
                onPress={() => faceBookLogin()}>
                <Image
                  source={require('../src/assets/img/sns_02.png')}
                  resizeMode="cover"
                  style={{
                    width: 70,
                    height: 70,
                    backgroundColor: '#3A589E',
                    borderRadius: 70,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                //  onPress ={()=>navigation.navigate('register_social', {title:'소셜로그인'})}>
                onPress={() => kakaoLogin()}>
                <Image
                  source={require('../src/assets/img/sns_03.png')}
                  resizeMode="cover"
                  style={{width: 70, height: 70, borderRadius: 70}}
                />
              </TouchableOpacity>
            </View> */}
            </View>
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('home')}
              >
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: '#4A26F4',
                    textDecorationLine: 'underline'
                  }}
                >
                  어플 구경하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Content>
    </Container>
  )
};

export default LoginScreen
