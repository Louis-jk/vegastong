import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {Container, Content, Thumbnail, Input, Item, Button} from 'native-base';

import qs from 'qs';
import axios from 'axios';
import {setToken, setDrawer} from '../Module/Reducer';
import {useSelector, useDispatch} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import Postcode from '@actbase/react-daum-postcode';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../Common/Header';
// import {
//   userInfoNickname,
//   userInfoDivision,
//   userInfoZipcode,
//   userInfoAddress,
//   userInfoAddressDetail,
//   userInfoImage,
// } from '../Module/UserInfoReducer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  userInfoId,
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
} from '../Module/UserInfoReducer';
Icon.loadFont();

const baseUrl = 'https://dmonster1826.cafe24.com';

const EditScreen = (props) => {
  const navigation = props.navigation;
  const title = props.route.params.title;

  const dispatch = useDispatch();

  // 유저 정보 불러오기
  const {
    ut_nickname,
    ut_mobile,
    ut_image,
    ut_join_type,
    ut_division,
    ut_zipcode,
    ut_address,
    ut_address_detail,
  } = useSelector((state) => state.UserInfoReducer);

  // const userPassword = ut_password;

  const [nickName, setNickName] = useState(ut_nickname);
  const [mobile, setMobile] = useState(ut_mobile);
  const [userImage, setUserImage] = useState(ut_image);
  const [userDivision, setUserDivision] = useState(ut_division);
  const [userZipCode, setUserZipCode] = useState(ut_zipcode);
  const [userAddress, setUserAddress] = useState(ut_address);
  const [userAddressDetail, setUserAddressDetail] = useState(ut_address_detail);

  const [checked, setChecked] = useState('first');

  // 다음 주소 api 모달 상태관리
  const [postModalView, setPostModalView] = useState(false);

  // image-crop-picker 가져온 이미지 저장
  const [profileimage, setProfileImage] = useState(null);
  const [changedProfileimage, changeProfileImage] = useState(null);

  const [checkedNick, setCheckedNick] = useState(false);

  const onSubmit = () => {
    if (
      !nickName &&
      !mobile &&
      !userDivision &&
      !userZipCode &&
      !userAddress &&
      !userAddressDetail
    ) {
      Alert.alert('비어있는 입력란이 있습니다.', '입력란을 채워주세요.', [
        {
          text: '확인',
        },
      ]);
    } else {
      axios({
        method: 'post',
        url: `${baseUrl}/api/user/modify_myinfo`,
        headers: {
          authorization: token,
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
        data: qs.stringify({
          ut_nickname: nickName,
          ut_division: userDivision,
          ut_zipcode: userZipCode,
          ut_address: userAddress,
          ut_address_detail: userAddressDetail,
        }),
      })
        .then((res) => {
          if (res.data.result === 'success') {
            dispatch(userInfoNickname(nickName));
            dispatch(userInfoDivision(userDivision));
            dispatch(userInfoZipcode(userZipCode));
            dispatch(userInfoAddress(userAddress));
            dispatch(userInfoAddressDetail(userAddressDetail));
            dispatch(userInfoImage(userImage));
            navigation.navigate('home');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const goToLogin = () => {
    navigation.navigate('login');
  };

  const logOutHandle = () => {
    AsyncStorage.clear().then(dispatch(setToken('')));
    dispatch(userInfoId(null));
    dispatch(userInfoNickname(null));
    dispatch(userInfoDivision(null));
    dispatch(userInfoJoinType(null));
    dispatch(userInfoSocialId(null));
    dispatch(userInfoPassword(null));
    dispatch(userInfoMobile(null));
    dispatch(userInfoZipcode(null));
    dispatch(userInfoAddress(null));
    dispatch(userInfoAddressDetail(null));
    dispatch(userInfoImage(null));
    dispatch(userInfoCreatedAt(null));
    dispatch(userInfoUpdatedAt(null));
    dispatch(userInfoFcmToken(null));
    goToLogin();
  };

  const leaveConfirm = () => {
    Alert.alert(
      '탈퇴하시겠습니까?',
      '탈퇴하시면 현재까지의 기록이 모두 사라집니다.',
      [
        {
          text: '탈퇴하기',
          onPress: () => leaveApp(),
        },
        {
          text: '취소하기',
          onPress: () => {},
        },
      ],
    );
  };

  const leaveApp = () => {
    axios({
      method: 'post',
      url: `${baseUrl}/api/user/leave_app`,
      headers: {
        authorization: token,
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        console.log('회원탈퇴 : ', res);

        if (res.data.result === 'success') {
          Alert.alert(
            '탈퇴되었습니다.',
            '기록이 모두 삭제되었습니다. 이틀동안은 재가입을 하실 수 없습니다.',
            [
              {
                text: '확인',
                onPress: () => logOutHandle(),
              },
            ],
          );
        }
      })
      .catch((err) => console.log(err));
  };

  // react-native-image-crop-picker 모듈 사용
  const pickImageHandler = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      sortOrder: 'none',
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperCircleOverlay: true,
      useFrontCamera: false,
      includeBase64: true,
      cropping: true,
    })
      .then((img) => {
        axios({
          method: 'post',
          url: `${baseUrl}/api/user/update_my_image`,
          headers: {
            authorization: token,
            'api-secret':
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
          },
          data: qs.stringify({
            image: img.data,
          }),
        })
          .then((res) => setUserImage(res.data.data.ut_image))
          .catch((err) => console.log(err));
      })
      .catch((e) => console.log(e.message ? e.message : e));
  };

  console.log('props 는 ? ', props);
  // Redux 연결
  console.log(
    'redux test token : ',
    useSelector((state) => state.Reducer.token),
  );

  // token값 불러오기 Reducer
  const {token} = useSelector((state) => state.Reducer);

  // 닉네임 중복 체크
  const checkUserNick = (nickName) => {
    if (nickName.length > 6) {
      Alert.alert('닉네임은 6자리 이하로 입력해주세요.');
      return false;
    }

    if (nickName == '') {
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
          ut_nickname: nickName,
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
          onPress: () => setNickName(''),
        },
      ],
    );
  };

  // 모바일 인증 아이디 저장 및 버튼 색상 변화 상태
  const [mobileConfirmId, setMobileConfirmId] = useState(null);
  const [isMobileConfirmed, setMobileConfirmed] = useState(false);
  const [isMobileConfirmNum, setMobileConfirmNum] = useState(false);

  // 본인인증(휴대전화번호) 문자발송 버튼
  const authenticateSMS = (register_mobile) => {
    if (register_mobile.length > 11) {
      Alert.alert('휴대전화번호가 올바르지 않습니다.');
      return false;
    }

    if (register_mobile === '') {
      Alert.alert('휴대전화번호를 입력해주세요.');
    } else {
      axios({
        method: 'post',
        url: `${baseUrl}/api/user/change_mobile`,
        headers: {
          authorization: token,
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
            Alert.alert('인증번호가 발송되었습니다.');
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
    } else {
      axios({
        method: 'post',
        url: `${baseUrl}/api/user/confirm_change_mobile`,
        headers: {
          authorization: token,
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
        data: qs.stringify({
          sm_id: mobileConfirmId,
          text: register_confirmMobile,
        }),
      })
        .then((res) => {
          console.log('인증:', res);
          if (res.data.result == 'success') {
            Alert.alert('휴대전화번호가 변경 되었습니다.');
            setMobileConfirmed(true);
          } else {
            Alert.alert('인증에 실패하였습니다.');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container>
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
                    setUserAddress(data.address + ' ' + data.buildingName);

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
          {/* 프로필 사진 수정 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pickImageHandler}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 30,
            }}>
            {userImage ? (
              <Thumbnail
                source={{
                  uri: `${baseUrl}${userImage}`,
                }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 120,
                  marginBottom: 10,
                }}
                resizeMode="cover"
              />
            ) : (
              <Thumbnail
                source={require('../src/assets/img/pr_no_img.png')}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 120,
                  marginBottom: 10,
                }}
                resizeMode="cover"
              />
            )}

            <Text
              style={{
                fontSize: 16,
                color: '#666',
                textDecorationLine: 'underline',
                padding: 10,
              }}>
              프로필사진 수정
            </Text>
          </TouchableOpacity>

          {/* 닉네임 수정 */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginBottom: 20,
            }}>
            <Text style={{fontSize: 18, marginBottom: 5}}>닉네임</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Input
                placeholder=""
                value={nickName}
                onChangeText={(text) => setNickName(text)}
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginRight: 5,
                }}
              />
              <TouchableOpacity
                onPress={() => checkUserNick(nickName)}
                style={[
                  !checkedNick
                    ? {
                        borderColor: '#4A26F4',
                        borderWidth: 1,
                        borderStyle: 'solid',
                      }
                    : null,
                  {
                    backgroundColor: checkedNick ? '#eaeaea' : 'transparent',
                    width: 100,
                    height: 50,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 45,
                    marginLeft: 5,
                    borderRadius: 10,
                    color: checkedNick ? '#B5B5B5' : '#4A26F4',
                  }}>
                  {checkedNick ? '중복확인' : '변경'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 사용자 구분 */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginBottom: 20,
            }}>
            <Text style={{fontSize: 18, marginBottom: 5}}>사용자 구분</Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setUserDivision('resident')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    userDivision === 'resident'
                      ? require('../src/assets/img/radio_on.png')
                      : require('../src/assets/img/radio_off.png')
                  }
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: '#333',
                    marginRight: 30,
                    marginLeft: 10,
                  }}>
                  지역인
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setUserDivision('traveler')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    userDivision === 'traveler'
                      ? require('../src/assets/img/radio_on.png')
                      : require('../src/assets/img/radio_off.png')
                  }
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: '#333',
                    marginRight: 30,
                    marginLeft: 10,
                  }}>
                  여행자
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 주소변경 */}
          {/* <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginBottom: 20,
            }}>
            <Text style={{fontSize: 18, marginBottom: 5}}>주소변경</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Input
                placeholder=""
                value={userAddress}
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                }}
                editable={false}
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
              placeholder=""
              value={userAddressDetail}
              placeholderTextColor="#E3E3E3"
              style={{
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#eee',
                borderRadius: 10,
                paddingLeft: 15,
              }}
              onChangeText={(text) => setUserAddressDetail(text)}
            />
          </View> */}

          {/* 핸드폰 번호 변경 */}
          {/* <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginBottom: 20
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 5 }}>핸드폰번호</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10
              }}
            >
              <Input
                placeholder=''
                value={mobile}
                onChangeText={(text) => setMobile(text)}
                placeholderTextColor='#E3E3E3'
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15
                }}
                keyboardType='number-pad'
              />
              <TouchableOpacity onPress={() => authenticateSMS(mobile)}>
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
                    color: '#4A26F4'
                  }}
                >
                  번호변경
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Input
                placeholder=''
                onChangeText={(text) => setMobileConfirmNum(text)}
                placeholderTextColor='#E3E3E3'
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15
                }}
                keyboardType='number-pad'
              />
              <TouchableOpacity
                onPress={() => confirmMobile(isMobileConfirmNum)}
                style={{
                  backgroundColor: isMobileConfirmed ? '#eaeaea' : '#4A26F4',
                  width: 100,
                  height: 50,
                  borderRadius: 10,
                  marginLeft: 5
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 45,
                    color: isMobileConfirmed ? '#B5B5B5' : '#fff'
                  }}
                >
                  {isMobileConfirmed ? '인증완료' : '인증'}
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}
          {ut_join_type === 'password' ? (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginBottom: 20,
              }}>
              <Text>비밀번호를 변경하고 싶으시면</Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ChangePW', {title: '비밀번호 변경하기'})
                }
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  marginVertical: 10,
                  backgroundColor: '#eaeaea',
                }}>
                <Text>비밀번호 변경하기</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* 수정하기 버튼 */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
              marginBottom: 80,
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onSubmit}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#4A26F4',
                paddingHorizontal: 70,
                paddingVertical: 15,
                borderRadius: 30,
                marginBottom: 15,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#fff',
                }}>
                수정하기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={leaveConfirm}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#4A26F4',
                borderWidth: 1,
                paddingHorizontal: 70,
                paddingVertical: 15,
                borderRadius: 30,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#4A26F4',
                }}>
                탈퇴하기
              </Text>
            </TouchableOpacity>
          </View>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default EditScreen;
