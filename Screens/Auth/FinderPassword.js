import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native'
import { Container, Content, Input, Button } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import Postcode from '@actbase/react-daum-postcode'
import Modal from 'react-native-modal'
import Header from '../Common/Header'
import qs from 'qs'

import { Formik } from 'formik'
import * as yup from 'yup'
import { VegasPost } from '../../utils/axios.config'

const FinderPassword = ({ navigation, route }) => {
  const title = route.params.title
  const type = route.params.type
  const Id = route.params.id

  const userIdInput = useRef()
  const dispatch = useDispatch()

  // 다음 주소 api 모달 상태관리
  const [postModalView, setPostModalView] = useState(false)

  // 회원가입 양식 폼 상태처리

  const [userNick, setUserNickValue] = useState('')
  const [userMobile, setUserMobileValue] = useState('')

  const [textInput, setTextInput] = useState('')
  const [isFocused, setFocus] = useState(false)

  // 닉네임 체크
  const [checkedNick, setCheckedNick] = useState(false)

  // 리셋

  const onResetNick = () => {
    setUserNickValue('')
  };

  const Find = async () => {
    if (userNick !== '' && userMobile !== '') {
      if (isMobileConfimed !== false) {
        const form = new FormData()
        form.append('ut_nickname', userNick)
        form.append('ut_mobile', userMobile)

        const res = await VegasPost('/api/user/search_password', form)

        if (res.result === 'success') {
          const id = res.data.ut_user_id
          Alert.alert(
            '비밀번호 초기화',
            `${userMobile}로 임시 비밀번호가 발송되었습니다.`,
            [
              {
                text: '확인(홈 이동)',
                onPress: () => {
                  navigation.navigate('loading')
                }
              }
            ]
          )
        } else {
          Alert.alert('비밀번호 초기화', res.error)
        }
      } else {
        Alert.alert('비밀번호찾기', '휴대폰 번호를 인증해주세요', [
          {
            text: '확인',
            onPress: () => {}
          }
        ])
      }
    }
  }

  // 모바일 인증 아이디 저장 및 버튼 색상 변화 상태
  const [userMobileAuthNum, setUserMobileAuthNum] = useState(null)
  const [mobileConfirmId, setMobileConfirmId] = useState(null)
  const [isMobileConfimed, setMobileConfimed] = useState(false)
  const [buttonPress, setbuttonPress] = useState(false)

  // 본인인증(휴대전화번호) 문자발송 버튼
  const [isSend, setIsSend] = useState(false)
  const authenticateSMS = (register_mobile) => {
    if (register_mobile.length > 11) {
      Alert.alert('휴대전화번호가 올바르지 않습니다.')
      return false
    }

    if (register_mobile === '') {
      Alert.alert('휴대전화번호를 입력해주세요.')
    } else {
      Alert.alert(
        `${register_mobile}로 인증번호가 발송되었습니다.`,
        '인증번호 확인 후 입력해주세요.',
        [
          {
            text: '확인',
            onPress: () => setIsSend(true)
          }
        ]
      )

      VegasPost(
        '/api/user/auth_sms',
        qs.stringify({
          mobile: register_mobile
        })
      )
        .then((res) => {
          if (res.result === 'success') {
            setMobileConfirmId(res.data.sm_id)
          } else {
            Alert.alert('휴대전화번호를 올바르게 입력해주세요.')
          }
        })
        .catch((err) => console.log(err))
    }
  }

  // 본인인증(휴대전화번호) 인증번호 확인 버튼
  const confirmMobile = (register_confirmMobile) => {
    if (register_confirmMobile === '') {
      Alert.alert('인증번호를 입력해주세요.')
      return false
    } else {
      VegasPost(
        '/api/user/confirm_sms',
        qs.stringify({
          sm_id: mobileConfirmId,
          text: register_confirmMobile
        })
      )
        .then((res) => {
          if (res.result === 'success') {
            Alert.alert('본인 인증되었습니다.')
            setMobileConfimed(true)
          } else {
            Alert.alert('인증에 실패하였습니다.')
          }
        })
        .catch((err) => console.log(err))
    }
  }

  const validationSchema = yup.object().shape({
    register_nickname: yup
      .string()
      .required('닉네임을 입력해주세요.')
      .label('User Nickname')
      .max(7, '닉네임은 7자리 이하로 입력해주세요.'),

    register_mobile: yup
      .string()
      .required('휴대전화번호를 입력해주세요.')
      .label('Mobile'),
    register_confirmMobile: yup
      .string()
      .required('인증번호를 입력해주세요.')
      .label('Mobile Confirm')
  })

  return (
    <Container>
      <ScrollView>
        {/* 다음 주소 api 모달 */}
        <Content>
          {/* 상단 헤더 */}
          <Header navigation={navigation} title={title} />

          {/* 사용자 아이디 입력 */}
          <View style={{ marginTop: 30 }} />
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              변경된 비밀번호는 입력한 전화번호로 전송됩니다.
            </Text>
          </View>

          <Formik
            initialValues={{
              register_nickname: '',
              register_mobile: '',
              register_confirmMobile: ''
            }}
            onSubmit={async (values, actions) => {
              if (isMobileConfimed !== false) {
                const form = new FormData()
                form.append('ut_nickname', values.register_nickname)
                form.append('ut_mobile', values.register_mobile)

                const res = await VegasPost('/api/user/search_password', form)

                if (res.result === 'success') {
                  const id = res.data.ut_user_id
                  Alert.alert(
                    '비밀번호 초기화',
                    `${values.register_mobile}로 임시 비밀번호가 발송되었습니다.`,
                    [
                      {
                        text: '확인(홈으로)',
                        onPress: () => {
                          navigation.navigate('loading')
                        }
                      }
                    ]
                  )
                } else {
                  Alert.alert('비밀번호 초기화', res.error)
                }

                setTimeout(() => {
                  actions.setSubmitting(false)
                }, 1000)
              }
            }}
            validationSchema={validationSchema}
          >
            {(formikProps) => (
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>닉네임</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Input
                      placeholder='닉네임을 입력해주세요.'
                      placeholderTextColor='#E3E3E3'
                      style={{
                        borderWidth: 1,
                        borderColor: formikProps.errors.register_nickname
                          ? '#4A26F4'
                          : '#eee',
                        borderRadius: 10,
                        paddingLeft: 10,
                        width: '70%'
                      }}
                      onChangeText={(value) => {
                        setCheckedNick(false)
                        formikProps.setFieldValue('register_nickname', value)
                      }}
                      autoCapitalize='none'
                      onBlur={formikProps.handleBlur('register_nickname')}
                      autoFocus
                    />
                  </View>
                  {formikProps.touched.register_nickname &&
                  formikProps.errors.register_nickname ? (
                    <Text style={{ color: '#4A26F4', marginBottom: 5 }}>
                      {formikProps.touched.register_nickname &&
                        formikProps.errors.register_nickname}
                    </Text>
                      ) : null}
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    휴대전화번호
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Input
                      placeholder='핸드폰번호 입력'
                      placeholderTextColor='#E3E3E3'
                      style={{
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#eee',
                        borderRadius: 10,
                        paddingLeft: 15,
                        marginBottom:
                          formikProps.touched.register_mobile &&
                          formikProps.errors.register_mobile &&
                          !formikProps.values.register_mobile
                            ? 0
                            : 5
                      }}
                      value={formikProps.values.register_mobile}
                      onChangeText={formikProps.handleChange('register_mobile')}
                      keyboardType='number-pad'
                    />
                    <Button
                      onPress={() =>
                        authenticateSMS(formikProps.values.register_mobile)}
                      style={[
                        {
                          backgroundColor: isSend ? '#ccc' : '#4A26F4',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 100,
                          height: 50,
                          textAlign: 'center',
                          lineHeight: 45,
                          marginLeft: 5,
                          borderRadius: 10,
                          elevation: 0
                        }
                      ]}
                      disabled={!!isSend}
                    >
                      <Text style={{ color: '#fff' }}>문자발송</Text>
                    </Button>
                  </View>
                  {formikProps.touched.register_mobile &&
                  formikProps.errors.register_mobile &&
                  !formikProps.values.register_mobile ? (
                    <Text style={{ color: '#4A26F4', marginBottom: 15 }}>
                      {formikProps.touched.register_mobile &&
                        formikProps.errors.register_mobile}
                    </Text>
                      ) : null}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Input
                      placeholder='인증번호 입력'
                      placeholderTextColor='#E3E3E3'
                      style={{
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#eee',
                        borderRadius: 10,
                        paddingLeft: 15,
                        marginBottom:
                          formikProps.touched.register_confirmMobile &&
                          formikProps.errors.register_confirmMobile
                            ? 0
                            : 5
                      }}
                      value={formikProps.values.register_confirmMobile}
                      onChangeText={formikProps.handleChange(
                        'register_confirmMobile'
                      )}
                      // onChangeText={(text) => setUserMobileAuthNum(text)}
                      keyboardType='number-pad'
                    />
                    <Button
                      onPress={() =>
                        confirmMobile(formikProps.values.register_confirmMobile)}
                      style={{
                        backgroundColor: isMobileConfimed ? '#ccc' : '#4A26F4',
                        width: 100,
                        height: 50,
                        borderRadius: 10,
                        marginLeft: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 0
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff'
                        }}
                      >
                        {isMobileConfimed ? '인증완료' : '인증하기'}
                      </Text>
                    </Button>
                  </View>
                  {formikProps.touched.register_confirmMobile &&
                  formikProps.errors.register_confirmMobile &&
                  !isMobileConfimed ? (
                    <Text style={{ color: '#4A26F4', marginBottom: 15 }}>
                      {formikProps.touched.register_confirmMobile &&
                        formikProps.errors.register_confirmMobile}
                    </Text>
                      ) : null}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: 30,
                    marginBottom: 80
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={formikProps.handleSubmit}
                    style={{
                      backgroundColor: '#4A26F4',
                      paddingHorizontal: 40,
                      paddingVertical: 15,
                      borderRadius: 30
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#fff'
                      }}
                    >
                      찾기
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </Content>
      </ScrollView>
    </Container>
  )
};

export default FinderPassword
