import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {Container, Content, Input, Button} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Postcode from '@actbase/react-daum-postcode';
import Modal from 'react-native-modal';
import Header from '../Common/Header';
import qs from 'qs';
import axios from 'axios';
import {Formik} from 'formik';
import * as yup from 'yup';
import {
  joinUserReReg,
  joinUserId,
  joinUserNickname,
  joinUserJoinType,
  joinUserPassword,
  joinUserMobile,
  joinUserZipcode,
  joinUserAddress,
  joinUserAddressDetail,
} from '../Module/JoinReducer';

const baseUrl = 'https://dmonster1826.cafe24.com';

const RegisterStep01Screen = (props) => {
  const navigation = props.navigation;
  const title = props.route.params.title;
  // props.route.params.reg_route 재가입 여부
  const params = props.route.params;

  const userIdInput = useRef();
  const dispatch = useDispatch();

  // 다음 주소 api 모달 상태관리
  const [postModalView, setPostModalView] = useState(false);

  // 회원가입 양식 폼 상태처리
  const [userId, setUserIdValue] = useState('');
  const [userNick, setUserNickValue] = useState('');
  const [userPw, setUserPwValue] = useState('');
  const [userRePw, setUserRePwValue] = useState('');
  const [userMobile, setUserMobileValue] = useState('');
  const [userMobileAuthNum, setUserMobileAuthNum] = useState(null);
  const [userZipCode, setUserZipCode] = useState('');
  const [userAddress, setUserAddressValue] = useState('');

  // 모바일 인증 아이디 저장 및 버튼 색상 변화 상태
  const [mobileConfirmId, setMobileConfirmId] = useState(null);
  const [isMobileConfimed, setMobileConfimed] = useState(false);

  // 본인인증(휴대전화번호) 문자발송 버튼
  const [isSend, setIsSend] = useState(false);
  const authenticateSMS = (register_mobile) => {
    if (register_mobile.length > 11) {
      Alert.alert('휴대전화번호가 올바르지 않습니다.');
      return false;
    }

    if (register_mobile === '') {
      Alert.alert('휴대전화번호를 입력해주세요.');
    } else {
      Alert.alert(
        `${register_mobile}로 인증번호가 발송되었습니다.`,
        '인증번호 확인 후 입력해주세요.',
        [
          {
            text: '확인',
            onPress: () => setIsSend(true),
          },
        ],
      );
      axios({
        method: 'post',
        url: `${baseUrl}/api/user/auth_sms`,
        headers: {
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
        data: qs.stringify({
          mobile: register_mobile,
        }),
      })
        .then((res) => {
          if (res.data.result == 'success') {
            setMobileConfirmId(res.data.data.sm_id);
          } else {
            Alert.alert('휴대전화번호를 올바르게 입력해주세요.');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // 본인인증(휴대전화번호) 인증번호 확인 버튼
  const confirmMobile = (register_confirmMobile) => {
    if (register_confirmMobile === '') {
      Alert.alert('인증번호를 입력해주세요.');
      return false;
    } else if (isSend === false) {
      Alert.alert(
        '정확한 번호로 문자발송해주세요.',
        '문자발송을 완료해주세요.',
        [
          {
            text: '확인',
            onPress: () => {},
          },
        ],
      );
      return false;
    } else {
      axios({
        method: 'post',
        url: `${baseUrl}/api/user/confirm_sms`,
        headers: {
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
        data: qs.stringify({
          sm_id: mobileConfirmId,
          text: register_confirmMobile,
        }),
      })
        .then((res) => {
          if (res.data.result == 'success') {
            Alert.alert('본인 인증되었습니다.');
            setMobileConfimed(true);
          } else {
            Alert.alert('인증에 실패하였습니다.');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // 리셋
  const onResetId = () => {
    setUserIdValue('');
  };

  const onResetNick = () => {
    setUserNickValue('');
  };

  // 아이디 중복체크
  const [checkedId, setCheckedId] = useState(false);
  const [checkedNick, setCheckedNick] = useState(false);

  const checkUserId = (register_id) => {
    if (register_id.length < 4) {
      Alert.alert('아이디를 4자리이상 입력바랍니다.');
      return false;
    }

    if (register_id.length > 20) {
      Alert.alert('아이디를 20자리이내로 입력바랍니다.');
      return false;
    }

    const reg = RegExp(/^[aA-zZ-_0-9]+$/);

    const checkRegId = register_id;

    if (register_id == '') {
      Alert.alert('아이디를 입력해주세요.');
    } else if (reg.test(checkRegId) === false) {
      Alert.alert(
        '아이디 생성 규칙에 따르십시요.',
        '아이디는 4자리 이상 20자리 이하로 영문 소문자/대문자, 숫자, 특수기호 - , _만 허용됩니다.',
      );
      return false;
    } else {
      axios({
        method: 'post',
        url: `${baseUrl}/api/user/check_user_id`,
        headers: {
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
        data: qs.stringify({
          ut_user_id: register_id,
        }),
      })
        .then((res) => {
          if (res.data.result == 'success') {
            Alert.alert('사용 가능한 아이디입니다.');
            setCheckedId(true);
          } else {
            IdAlertMsg();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const IdAlertMsg = () => {
    setCheckedId(false);
    Alert.alert(
      '이미 사용 중인 아이디입니다.',
      '다른 아이디를 사용해 주십시요.',
      [
        {
          text: '확인',
          onPress: () => onResetId(),
        },
      ],
    );
  };

  // 닉네임 중복 체크
  const checkUserNick = (register_nickname) => {
    if (register_nickname.length > 7) {
      Alert.alert('닉네임은 7자리 이하로 입력해주세요.');
      return false;
    }

    if (register_nickname == '') {
      Alert.alert('닉네임을 입력해주세요.');
    } else {
      axios({
        method: 'post',
        url: `${baseUrl}/api/user/check_nickname`,
        headers: {
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
        data: qs.stringify({
          ut_nickname: register_nickname,
        }),
      })
        .then((res) => {
          if (res.data.result == 'success') {
            Alert.alert('사용 가능한 닉네임입니다.');
            setCheckedNick(true);
          } else {
            PwAlertMsg();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const PwAlertMsg = () => {
    Alert.alert(
      '이미 사용 중인 닉네임입니다.',
      '다른 닉네임을 사용해 주십시요.',
      [
        {
          text: '확인',
          onPress: () => onResetNick(),
        },
      ],
    );
  };

  const validationSchema = yup.object().shape({
    register_id: yup
      .string()
      .matches(/^[aA-zZ\-\_0-9]+$/, {
        message:
          '아이디는 4자리 이상 20자리 이하로 영문 소문자/대문자, 숫자, 특수기호 - , _만 허용됩니다.',
      })
      .required('아이디를 입력해주세요.')
      .label('User Id')
      .min(4, '아이디는 4자리 이상 입력해주세요.')
      .max(20, '아이디는 20자리 이하로 입력해주세요.'),
    register_nickname: yup
      .string()
      .required('닉네임을 입력해주세요.')
      .label('User Nickname')
      .max(7, '닉네임은 7자리 이하로 입력해주세요.'),
    register_pw: yup
      .string()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[!@#$%&\w'*+-/=?^_{|}~])(?=.*[0-9]).{8,16}$/,
        {
          message:
            '비밀번호는 8자리 이상 16자리 이하로 영문 소문자/대문자, 숫자, 특수기호 조합으로 입력해주세요.',
        },
      )
      .required('비밀번호를 입력해주세요.')
      .label('Password')
      .min(8, '비밀번호는 8자리 이상 입력해주세요.')
      .max(16, '비밀번호는 16자리 이하로 입력해주세요'),
    register_confirmPw: yup
      .string()
      .required('비밀번호를 재입력 해주세요.')
      .label('Confirm password')
      .test(
        'passwords-match',
        '재입력하신 비밀번호가 초기 비밀번호와 일치하지 않습니다.',
        function (value) {
          return this.parent.register_pw === value;
        },
      ),
    // register_mobile: yup
    //   .string()
    //   .required('휴대전화번호를 입력해주세요.')
    //   .label('Mobile'),
    // register_confirmMobile: yup
    //   .string()
    //   .required('인증번호를 입력해주세요.')
    //   .label('Mobile Confirm'),

    // register_address_detail: yup
    //   .string()
    //   .required('상세주소를 입력해주세요.')
    //   .label('Address Detail')
  });

  return (
    <Container>
      {/* 상단 헤더 */}
      <Header navigation={navigation} title={title} />
      <ScrollView>
        {/* 다음 주소 api 모달 */}
        <Modal animationType="fade" transparent visible={postModalView}>
          <View style={{backgroundColor: '#4A26F4', borderRadius: 10}}>
            <View
              style={[
                {
                  width: '95%',
                  paddingVertical: 30,
                  paddingHorizontal: 10,
                  margin: 10,
                },
              ]}>
              <View style={{width: '100%', height: 300}}>
                <Postcode
                  style={{flex: 1}}
                  jsOptions={{animated: true}}
                  onSelected={(data) => {
                    // console.log(JSON.stringify(data));
                    setUserZipCode(data.zonecode);
                    setUserAddressValue(data.address + ' ' + data.buildingName);

                    console.log('다음post api : ', data);
                    // setFieldValue('ct_addr', data.address);
                    // setFieldTouched('ct_addr_detail');
                    setPostModalView(false);
                  }}
                />
              </View>

              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setPostModalView(false);
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 150,
                    height: 45,
                    borderRadius: 25,
                    backgroundColor: '#fff',
                  }}>
                  <Text style={{fontSize: 16}}>닫기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Content>
          <View style={{marginTop: 30}} />
          <Formik
            initialValues={{
              register_id: '',
              register_nickname: '',
              register_pw: '',
              register_confirmPw: '',
              // register_mobile: '',
              // register_confirmMobile: '',
              // register_zipcode: '',
              // register_address: '',
              // register_address_detail: ''
            }}
            onSubmit={(values, actions) => {
              if (
                checkedId &&
                checkedNick
                // &&
                // isMobileConfimed &&
                // userZipCode &&
                // userAddress
              ) {
                dispatch(joinUserId(values.register_id));
                dispatch(joinUserNickname(values.register_nickname));
                dispatch(joinUserJoinType('password'));
                dispatch(joinUserPassword(values.register_pw));
                // dispatch(joinUserMobile(values.register_mobile));
                // dispatch(joinUserZipcode(userZipCode));
                // dispatch(joinUserAddress(userAddress));
                // dispatch(joinUserAddressDetail(values.register_address_detail));
                navigation.navigate('register_step02', {
                  title: title,
                  reg_route: params.reg_route ? 'reJoin' : null,
                }); // props.route.params.reg_route 재가입 여부
              } else {
                Alert.alert('인증되지 않은 입력란이 있습니다.');
                return false;
              }

              setTimeout(() => {
                actions.setSubmitting(false);
              }, 1000);
            }}
            validationSchema={validationSchema}>
            {(formikProps) => (
              <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                <View style={{marginBottom: 20}}>
                  <Text style={{fontSize: 18, marginBottom: 10}}>
                    사용자 아이디
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Input
                      placeholder="아이디를 입력해주세요."
                      placeholderTextColor="#E3E3E3"
                      style={{
                        borderWidth: 1,
                        borderColor: '#eee',
                        borderRadius: 10,
                        paddingLeft: 15,
                      }}
                      // onChangeText={formikProps.handleChange('register_id')}
                      onChangeText={(value) => {
                        setCheckedId(false);
                        formikProps.setFieldValue('register_id', value);
                      }}
                      autoCapitalize="none"
                      onBlur={formikProps.handleBlur('register_id')}
                      autoFocus
                    />
                    <Button
                      activeOpacity={0.6}
                      onPress={() => {
                        checkUserId(formikProps.values.register_id);
                        Keyboard.dismiss();
                      }}
                      style={{
                        width: 100,
                        height: 50,
                        backgroundColor: checkedId ? '#ccc' : '#4A26F4',
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 5,
                        color: '#fff',
                        elevation: 0,
                      }}
                      disabled={!!checkedId}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#fff',
                        }}>
                        중복확인
                      </Text>
                    </Button>
                  </View>
                  {!formikProps.values.register_id &&
                  !formikProps.errors.register_id &&
                  checkedId === false ? (
                    <Text
                      style={{
                        color: '#B5B5B5',
                        lineHeight: 20,
                        marginBottom: 2,
                      }}>
                      아이디는 영문, 숫자, 특수기호(- , _ 만 허용)만 사용
                      가능하며, 4자리 이상, 20자리 이내로 입력해주세요.
                    </Text>
                  ) : formikProps.touched.register_id &&
                    formikProps.values.register_id &&
                    checkedId === false ? (
                    <Text
                      style={{
                        color: '#4A26F4',
                      }}>
                      아이디 중복확인을 해주세요.
                    </Text>
                  ) : formikProps.touched.register_id &&
                    !formikProps.errors.register_id &&
                    checkedId ? (
                    <Text
                      style={{
                        color: '#B5B5B5',
                        lineHeight: 20,
                        marginBottom: 2,
                      }}>
                      사용가능한 아이디입니다.
                    </Text>
                  ) : formikProps.touched.register_id &&
                    formikProps.errors.register_id ? (
                    <Text style={{color: '#4A26F4', marginBottom: 5}}>
                      {formikProps.touched.register_id &&
                        formikProps.errors.register_id}
                    </Text>
                  ) : checkedId && formikProps.touched.register_id ? (
                    setCheckedId(false)
                  ) : null}
                </View>

                <View style={{marginBottom: 20}}>
                  <Text style={{fontSize: 18, marginBottom: 10}}>닉네임</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Input
                      placeholder="닉네임을 입력해주세요."
                      placeholderTextColor="#E3E3E3"
                      style={{
                        borderWidth: 1,
                        borderColor: '#eee',
                        borderRadius: 10,
                        paddingLeft: 10,
                        width: '70%',
                      }}
                      onChangeText={(value) => {
                        setCheckedNick(false);
                        formikProps.setFieldValue('register_nickname', value);
                      }}
                      autoCapitalize="none"
                      onBlur={formikProps.handleBlur('register_nickname')}
                    />
                    <Button
                      activeOpacity={0.6}
                      onPress={() =>
                        checkUserNick(formikProps.values.register_nickname)
                      }
                      style={{
                        width: 100,
                        height: 50,
                        backgroundColor: checkedNick ? '#ccc' : '#4A26F4',
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 5,
                        elevation: 0,
                      }}
                      disabled={!!checkedNick}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#fff',
                        }}>
                        중복확인
                      </Text>
                    </Button>
                  </View>
                  {formikProps.touched.register_nickname &&
                  formikProps.errors.register_nickname ? (
                    <Text style={{color: '#4A26F4', marginBottom: 5}}>
                      {formikProps.touched.register_nickname &&
                        formikProps.errors.register_nickname}
                    </Text>
                  ) : formikProps.touched.register_nickname &&
                    formikProps.values.register_nickname &&
                    checkedNick === false ? (
                    <Text
                      style={{
                        color: '#4A26F4',
                      }}>
                      닉네임 중복확인을 해주세요.
                    </Text>
                  ) : formikProps.touched.register_nickname &&
                    !formikProps.errors.register_nickname &&
                    checkedNick ? (
                    <Text
                      style={{
                        color: '#B5B5B5',
                        lineHeight: 20,
                        marginBottom: 2,
                      }}>
                      사용가능한 닉네임입니다.
                    </Text>
                  ) : null}
                </View>

                <View>
                  <Text style={{fontSize: 18, marginBottom: 10}}>비밀번호</Text>
                  <Input
                    placeholder="영문 숫자 특수기호 조합 8자리 이상"
                    placeholderTextColor="#E3E3E3"
                    style={{
                      borderWidth: 1,
                      borderColor: '#eee',
                      borderRadius: 10,
                      paddingLeft: 10,
                      marginBottom:
                        formikProps.touched.register_pw &&
                        formikProps.errors.register_pw
                          ? 0
                          : 5,
                    }}
                    onChangeText={formikProps.handleChange('register_pw')}
                    autoCapitalize="none"
                    onBlur={formikProps.handleBlur('register_pw')}
                    secureTextEntry
                  />
                  {!formikProps.values.register_pw &&
                  !formikProps.errors.register_pw ? (
                    <Text
                      style={{
                        color: '#B5B5B5',
                        lineHeight: 20,
                        marginBottom: 5,
                      }}>
                      비밀번호는 영문, 숫자, 특수기호 조합으로 8자리~16자리
                      이내로 입력해주세요.
                    </Text>
                  ) : formikProps.touched.register_pw &&
                    formikProps.errors.register_pw ? (
                    <Text
                      style={{
                        color: '#4A26F4',
                        marginBottom: 10,
                      }}>
                      {formikProps.touched.register_pw &&
                        formikProps.errors.register_pw}
                    </Text>
                  ) : null}
                </View>
                <View style={{marginBottom: 20}}>
                  <Input
                    placeholder="비밀번호를 다시 한번 입력해주세요."
                    placeholderTextColor="#E3E3E3"
                    style={{
                      borderWidth: 1,
                      borderColor: '#eee',
                      borderRadius: 10,
                      paddingLeft: 10,
                    }}
                    onChangeText={formikProps.handleChange(
                      'register_confirmPw',
                    )}
                    autoCapitalize="none"
                    onBlur={formikProps.handleBlur('register_confirmPw')}
                    secureTextEntry
                  />
                  <Text style={{color: '#4A26F4'}}>
                    {formikProps.touched.register_confirmPw &&
                      formikProps.errors.register_confirmPw}
                  </Text>
                </View>
                {/* <View style={{marginBottom: 20}}>
                  <Text style={{fontSize: 18, marginBottom: 10}}>본인인증</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Input
                      placeholder="핸드폰번호 입력"
                      placeholderTextColor="#E3E3E3"
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
                            : 5,
                      }}
                      value={formikProps.values.register_mobile}
                      // onChangeText={formikProps.handleChange('register_mobile')}
                      onChangeText={(value) => {
                        setIsSend(false);
                        formikProps.setFieldValue('register_mobile', value);
                      }}
                      keyboardType="number-pad"
                    />
                    <Button
                      onPress={() =>
                        authenticateSMS(formikProps.values.register_mobile)
                      }
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
                          elevation: 0,
                        },
                      ]}
                      disabled={isSend ? true : false}>
                      <Text style={{color: '#fff'}}>문자발송</Text>
                    </Button>
                  </View>
                  {formikProps.touched.register_mobile &&
                  formikProps.errors.register_mobile &&
                  !formikProps.values.register_mobile ? (
                    <Text style={{color: '#4A26F4', marginBottom: 15}}>
                      {formikProps.touched.register_mobile &&
                        formikProps.errors.register_mobile}
                    </Text>
                  ) : null}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Input
                      placeholder="인증번호 입력"
                      placeholderTextColor="#E3E3E3"
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
                            : 5,
                      }}
                      value={formikProps.values.register_confirmMobile}
                      onChangeText={formikProps.handleChange(
                        'register_confirmMobile',
                      )}
                      // onChangeText={(text) => setUserMobileAuthNum(text)}
                      keyboardType="number-pad"
                    />
                    <Button
                      onPress={() =>
                        confirmMobile(formikProps.values.register_confirmMobile)
                      }
                      style={{
                        backgroundColor: isMobileConfimed ? '#ccc' : '#4A26F4',
                        width: 100,
                        height: 50,
                        borderRadius: 10,
                        marginLeft: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 0,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                        }}>
                        {isMobileConfimed ? '인증완료' : '인증하기'}
                      </Text>
                    </Button>
                  </View>
                  {formikProps.touched.register_confirmMobile &&
                  formikProps.errors.register_confirmMobile &&
                  !isMobileConfimed ? (
                    <Text style={{color: '#4A26F4', marginBottom: 15}}>
                      {formikProps.touched.register_confirmMobile &&
                        formikProps.errors.register_confirmMobile}
                    </Text>
                  ) : null}
                </View> */}

                {/* 주소입력 - Daum API */}
                {/* <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>주소</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Input
                      placeholder='주소입력'
                      placeholderTextColor='#E3E3E3'
                      style={{
                        borderWidth: 1,
                        borderColor: '#eee',
                        borderRadius: 10,
                        paddingLeft: 15,
                        marginBottom:
                          formikProps.touched.register_address && !userAddress
                            ? 0
                            : 5
                      }}
                      editable={false}
                      onChangeText={formikProps.handleChange(
                        'register_address'
                      )}
                      // value={formikProps.values.register_address}
                      autoCapitalize='none'
                      onBlur={formikProps.handleBlur('register_address')}
                      value={userAddress || null}
                      // onChangeText={(text) => setUserAddressValue(text)}
                    />
                    <Button
                      onPress={() => setPostModalView(true)}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#4A26F4',
                        width: 100,
                        height: 50,
                        textAlign: 'center',
                        marginLeft: 5,
                        borderRadius: 10,
                        elevation: 0
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff'
                        }}
                      >
                        주소검색
                      </Text>
                    </Button>
                  </View>
                  {formikProps.touched.register_address && !userAddress ? (
                    <Text style={{ color: '#4A26F4', marginBottom: 15 }}>
                      주소를 입력해주세요.
                    </Text>
                  ) : null}
                  <Input
                    placeholder='상세주소'
                    placeholderTextColor='#E3E3E3'
                    style={{
                      borderWidth: 1,
                      borderColor: '#eee',
                      borderRadius: 10,
                      paddingLeft: 15
                    }}
                    // onChangeText={(text) => setUserAddressDetailValue(text)}
                    onChangeText={formikProps.handleChange(
                      'register_address_detail'
                    )}
                    value={formikProps.values.register_address_detail}
                    autoCapitalize='none'
                    onBlur={formikProps.handleBlur('register_address_detail')}
                  />
                  {formikProps.touched.register_address_detail &&
                  formikProps.errors.register_address_detail ? (
                    <Text style={{ color: '#4A26F4', marginBottom: 5 }}>
                      {formikProps.touched.register_address_detail &&
                        formikProps.errors.register_address_detail}
                    </Text>
                      ) : null}
                </View> */}

                {formikProps.isSubmitting ? (
                  <ActivityIndicator />
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      marginTop: 30,
                      marginBottom: 80,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={formikProps.handleSubmit}
                      style={{
                        backgroundColor: '#4A26F4',
                        paddingHorizontal: 40,
                        paddingVertical: 15,
                        borderRadius: 30,
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#fff',
                        }}>
                        다음
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </Formik>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default RegisterStep01Screen;
