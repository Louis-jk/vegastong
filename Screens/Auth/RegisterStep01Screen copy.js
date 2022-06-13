import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {Container, Content, Input} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Postcode from '@actbase/react-daum-postcode';
import Modal from 'react-native-modal';
import Header from '../Common/Header';
import qs from 'qs';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {
  joinUserId,
  joinUserNickname,
  joinUserPassword,
  joinUserMobile,
  joinUserAddress,
  joinUserAddressDetail,
} from '../Module/JoinReducer';

const baseUrl = 'https://dmonster1826.cafe24.com';

const RegisterStep01Screen = ({navigation, route}) => {
  const title = route.params.title;

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
  const [userAddressDetail, setUserAddressDetailValue] = useState('');

  const [textInput, setTextInput] = useState('');
  const [isFocused, setFocus] = useState(false);

  // 모바일 인증 아이디 저장 및 버튼 색상 변화 상태
  const [mobileConfirmId, setMobileConfirmId] = useState(null);
  const [isMobileConfimed, setMobileConfimed] = useState(false);

  // error 처리
  const [userPwError, setUserPwError] = useState(false);
  const [result, setResult] = useState('');

  // 본인인증(휴대전화번호) 문자발송 버튼
  const authenticateSMS = () => {
    axios({
      method: 'post',
      url: `${baseUrl}/api/user/auth_sms`,
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
      data: qs.stringify({
        mobile: userMobile,
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
  };

  // 본인인증(휴대전화번호) 인증번호 확인 버튼
  const confirmMobile = () => {
    axios({
      method: 'post',
      url: `${baseUrl}/api/user/confirm_sms`,
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
      data: qs.stringify({
        sm_id: mobileConfirmId,
        text: userMobileAuthNum,
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
  };

  // 리셋
  const onResetId = () => {
    setUserIdValue('');
  };

  const onResetNick = () => {
    setUserNickValue('');
  };

  // 아이디 중복체크
  const checkUserId = async () => {
    await axios({
      method: 'post',
      url: `${baseUrl}/api/user/check_user_id`,
      data: qs.stringify({
        ut_user_id: userId,
      }),
    })
      .then((res) =>
        res.data.result == 'success'
          ? Alert.alert('사용 가능한 아이디입니다.')
          : IdAlertMsg(),
      )
      .catch((err) => console.log(err));
  };

  const IdAlertMsg = () => {
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
  const checkUserNick = async () => {
    await axios({
      method: 'post',
      url: `${baseUrl}/api/user/check_nickname`,
      data: qs.stringify({
        ut_nickname: userNick,
      }),
    })
      .then((res) =>
        res.data.result == 'success'
          ? Alert.alert('사용 가능한 닉네임입니다.')
          : PwAlertMsg(),
      )
      .catch((err) => console.log(err));
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

  // 다음 스텝으로 넘어가기 전 최종 체크
  const step01SubmitBtn = () => {
    if (
      !userId ||
      !userNick ||
      !userPw ||
      !userRePw ||
      !userMobile ||
      !userAddress ||
      !userAddressDetail
    ) {
      Alert.alert('양식을 채워 주십시요.', '입력란을 모두 채우셔야 합니다.', [
        {
          text: '확인',
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    } else if (userPw !== userRePw) {
      Alert.alert(
        '비밀번호가 서로 일치하지 않습니다.',
        '비밀번호를 다시 재확인 해주십시요.',
        [
          {
            text: '확인',
            onPress: () => console.log('OK Pressed'),
          },
        ],
      ); // else if { const regId = '/^[a-z0-9_-]{4,16}$/'; userId
    } else {
      dispatch(joinUserId(userId));
      dispatch(joinUserNickname(userNick));
      dispatch(joinUserPassword(userPw));
      dispatch(joinUserMobile(userMobile));
      dispatch(joinUserAddress(userAddress));
      dispatch(joinUserAddressDetail(userAddressDetail));
      navigation.navigate('register_step02', {title: title});
    }
  };

  return (
    <Container>
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
          {/* 상단 헤더 */}
          <Header navigation={navigation} title={title} />

          {/* 사용자 아이디 입력 */}
          <View style={{marginTop: 30}} />
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 10}}>사용자 아이디</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Input
                placeholder="아이디를 입력해주세요"
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: isFocused ? '#4A26F4' : '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                }}
                value={userId}
                ref={userIdInput}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => setUserIdValue(text)}
              />
              <TouchableOpacity activeOpacity={0.6} onPress={checkUserId}>
                <Text
                  style={{
                    borderColor: '#4A26F4',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    backgroundColor: 'transparent',
                    width: 100,
                    height: 50,
                    textAlign: 'center',
                    lineHeight: 45,
                    marginLeft: 5,
                    borderRadius: 10,
                    color: '#4A26F4',
                  }}>
                  중복확인
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              {!userId ? null : (
                <Text style={{marginLeft: 5, marginTop: 5, color: '#666666'}}>
                  {userId.length < 4 ? (
                    <View>
                      <Text style={{color: '#666666', lineHeight: 20}}>
                        영문, 숫자 포함해서 4자리 이상 넣어주세요.
                      </Text>
                      <Text style={{color: '#666666'}}>
                        ※ 특수문자는 -(하이픈) , _(언더스코어)만 가능합니다.
                      </Text>
                    </View>
                  ) : null}
                </Text>
              )}
            </View>
          </View>

          {/* 닉네임 입력 */}
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 10}}>닉네임</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Input
                placeholder="닉네임을 입력해주세요"
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: isFocused ? '#4A26F4' : '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                }}
                // onFocus={onFocusChange}
                onChangeText={(text) => setUserNickValue(text)}
              />
              <TouchableOpacity
                activeOpacity={0.6}
                underlayColor="#4A26F4"
                onPress={checkUserNick}>
                <Text
                  style={{
                    borderColor: '#4A26F4',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    backgroundColor: 'transparent',
                    width: 100,
                    height: 50,
                    textAlign: 'center',
                    lineHeight: 45,
                    marginLeft: 5,
                    borderRadius: 10,
                    color: '#4A26F4',
                  }}>
                  중복확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 비밀번호 입력 */}
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 10}}>비밀번호</Text>
            <View>
              <Input
                placeholder="영문 숫자 특수문자 조합 8자리 ~ 16자리"
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5,
                }}
                onChangeText={(text) => setUserPwValue(text)}
                secureTextEntry
              />
              {!userPw ? null : (
                <Text
                  style={{
                    marginLeft: 5,
                    marginTop: 5,
                    marginBottom: 15,
                    color: '#666666',
                  }}>
                  {userPw.length < 8 || userPw.length > 16 ? (
                    <View>
                      <Text style={{color: '#666666', lineHeight: 20}}>
                        영문, 숫자, 특수문자를 조합하여
                      </Text>
                      <Text style={{color: '#666666'}}>
                        8자 이상 16자 이하로 넣어주세요.
                      </Text>
                    </View>
                  ) : null}
                </Text>
              )}
              <Input
                placeholder="비밀번호 확인"
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                }}
                onChangeText={(text) => setUserRePwValue(text)}
                secureTextEntry
              />
            </View>
          </View>

          {/* 핸드폰 번호 입력 - 본인인증 */}
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 10}}>본인인증</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
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
                }}
                onChangeText={(text) => setUserMobileValue(text)}
                keyboardType="number-pad"
              />
              <TouchableOpacity onPress={authenticateSMS}>
                <Text
                  style={{
                    borderColor: '#4A26F4',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    backgroundColor: 'transparent',
                    width: 100,
                    height: 50,
                    textAlign: 'center',
                    lineHeight: 45,
                    marginLeft: 5,
                    borderRadius: 10,
                    color: '#4A26F4',
                  }}>
                  문자발송
                </Text>
              </TouchableOpacity>
            </View>
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
                }}
                onChangeText={(text) => setUserMobileAuthNum(text)}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                onPress={confirmMobile}
                style={{
                  backgroundColor: isMobileConfimed ? '#DDDDDD' : '#4A26F4',
                  width: 100,
                  height: 50,
                  borderRadius: 10,
                  marginLeft: 5,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 45,
                    color: isMobileConfimed ? '#B5B5B5' : '#fff',
                  }}>
                  {isMobileConfimed ? '인증완료' : '인증'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 주소 입력 */}
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 10}}>주소</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Input
                placeholder="주소입력"
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                }}
                editable={false}
                value={userAddress || null}
                onChangeText={(text) => setUserAddressValue(text)}
              />
              <TouchableOpacity onPress={() => setPostModalView(true)}>
                <Text
                  style={{
                    borderColor: '#4A26F4',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    backgroundColor: 'transparent',
                    width: 100,
                    height: 50,
                    textAlign: 'center',
                    lineHeight: 45,
                    marginLeft: 5,
                    borderRadius: 10,
                    color: '#4A26F4',
                  }}>
                  주소검색
                </Text>
              </TouchableOpacity>
            </View>
            <Input
              placeholder="상세주소"
              placeholderTextColor="#E3E3E3"
              style={{
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#eee',
                borderRadius: 10,
                paddingLeft: 15,
              }}
              onChangeText={(text) => setUserAddressDetailValue(text)}
            />
          </View>

          {/* 다음 버튼 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 30,
              marginBottom: 80,
              paddingHorizontal: 20,
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={step01SubmitBtn}
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
        </Content>
      </ScrollView>
    </Container>
  );
};

export default RegisterStep01Screen;
