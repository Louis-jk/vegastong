import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import {Container, Content, Input, Footer} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import Header from '../Common/Header';
import qs from 'qs';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const baseUrl = 'https://dmonster1826.cafe24.com';

const RegisterStep02Screen = (props) => {
  const navigation = props.navigation;
  const title = props.route.params.title;
  console.log('reg02 props :: ', props);
  const params = props.route.params;

  // RegisterStep01에서 입력받은 회원 총 정보 Redux에서 받아오기
  const {
    ut_user_id,
    ut_social_id,
    ut_nickname,
    ut_division,
    ut_join_type,
    ut_password,
    ut_mobile,
    ut_address,
    ut_address_detail,
    social_type,
    ut_zipcode,
  } = useSelector((state) => state.JoinReducer);

  console.log('redux에서 : ', {
    ut_user_id,
    ut_social_id,
    ut_nickname,
    ut_division,
    ut_join_type,
    ut_password,
    ut_mobile,
    ut_address,
    ut_address_detail,
    social_type,
    ut_zipcode,
  });

  // const [selectedUser, setSelectedUser] = useState('');

  const [userDivision, setUserDivision] = useState('');

  const userSelect = (u) => {
    // setSelectedUser(u);
    setUserDivision(u);
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible(!isModalVisible);

  const isCancelBtn = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const isCancelConfirmBtn = () => {
    setModalVisible(true);
  };

  const onSocialSubmit = async () => {
    if (userDivision === '') {
      return Alert.alert('회원가입', '사용자 구분을 선택해주세요', [
        {text: '확인', onPress: () => {}},
      ]);
    } else if (params.reg_route === 'reJoin') {
      try {
        const join = await axios({
          method: 'post',
          url: `${baseUrl}/api/user/rejoin_app`,
          data: qs.stringify({
            ut_join_type: ut_join_type,
            ut_social_id: ut_social_id,
            ut_nickname,
            ut_division: userDivision,
            ut_mobile,
            ut_zipcode,
            ut_address,
            ut_address_detail,
          }),
          headers: {
            'api-secret':
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
          },
        });
        console.log(join);

        if (join.data.result === 'success') {
          await AsyncStorage.setItem('@vegasTongToken', join.data.data.token);
          navigation.navigate('register_step03', {
            title: '회원가입 완료',
            id: join.data.data.user.ut_id,
          });
        }
      } catch (e) {
        console.log('회원가입 오류입니다.', e);
      }
    } else {
      try {
        const join = await axios({
          method: 'post',
          url: `${baseUrl}/api/user/join`,
          data: qs.stringify({
            ut_join_type: ut_join_type,
            ut_social_id: ut_social_id,
            ut_nickname,
            ut_division: userDivision,
            ut_mobile,
            ut_zipcode,
            ut_address,
            ut_address_detail,
          }),
          headers: {
            'api-secret':
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
          },
        });
        console.log(join);
        const data = join.data.data;
        if (join.data.result === 'success') {
          await AsyncStorage.setItem('@vegasTongToken', join.data.data.token);
          navigation.navigate('register_step03', {
            title: '회원가입 완료',
            id: join.data.data.user.ut_id,
          });
        }
      } catch (e) {
        console.log('회원가입 오류입니다.', e);
      }
    }
  };

  const onSubmit = async () => {
    if (userDivision === '') {
      return Alert.alert('회원가입', '사용자 구분을 선택해주세요', [
        {text: '확인', onPress: () => {}},
      ]);
    } else {
      await axios({
        method: 'post',
        url: `${baseUrl}/api/user/join`,
        data: qs.stringify({
          ut_join_type,
          ut_user_id,
          ut_nickname,
          ut_division: userDivision,
          ut_password,
          ut_mobile,
          ut_zipcode,
          ut_address,
          ut_address_detail,
        }),
        headers: {
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
      })
        .then((res) =>
          res.data.data.result == 'success'
            ? AsyncStorage.setItem('@vegasTongToken', res.data.data.data.token)
            : console.log(res.data.data.error),
        )
        .then(
          navigation.navigate('register_step03', {
            title: '회원가입 완료',
          }),
        )
        .catch((err) => console.error(err));
    }
  };

  return (
    <Container
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      {/* 모달 설정 */}
      <Modal
        isVisible={isModalVisible}
        animationIn="fadeIn"
        backdropOpacity={0.7}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          {/* 모달 전체 레이아웃 */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 15,
              paddingVertical: 10,
            }}>
            {/* 취소 여부 */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 30,
              }}>
              <Text style={{fontSize: 22, color: '#333', marginBottom: 10}}>
                취소하시겠습니까?
              </Text>

              {/* 취소 버튼 */}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginTop: 20,
                    marginBottom: 20,
                    paddingHorizontal: 40,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleModal()}>
                    <Text
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        backgroundColor: 'transparent',
                        paddingHorizontal: 50,
                        paddingVertical: 15,
                        borderRadius: 30,
                        fontSize: 18,
                        color: '#E3E3E3',
                      }}>
                      닫기
                    </Text>
                  </TouchableOpacity>
                  <View style={{width: 10}} />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => isCancelBtn()}>
                    <Text
                      style={{
                        backgroundColor: '#4A26F4',
                        paddingHorizontal: 50,
                        paddingVertical: 15,
                        borderRadius: 30,
                        fontSize: 18,
                        color: '#fff',
                      }}>
                      확인
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          {/* //모달 전체 레이아웃 */}
        </View>
      </Modal>

      <ScrollView>
        <Content>
          {/* 상단 헤더 */}
          <Header navigation={navigation} title={title} />
          {/* 사용자 아이디 입력 */}
          <View style={{marginTop: 50}} />
          <View
            style={{
              marginTop: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 24, marginBottom: 15}}>사용자 구분</Text>
            <Text style={{fontSize: 16, color: '#666666', marginBottom: 5}}>
              본인의 사용자 스타일을 선택해주세요
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginVertical: 40,
              }}>
              <View
                style={{
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => userSelect('traveler')}
                  activeOpacity={1}>
                  <ImageBackground
                    source={require('../src/assets/img/btn_user01.png')}
                    style={{
                      position: 'relative',
                      width: 150,
                      height: 150,
                      borderRadius: 150,
                    }}
                    resizeMode="contain">
                    {userDivision == 'traveler' ? (
                      <Image
                        source={require('../src/assets/img/btn_user_ck.png')}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: 150,
                          height: 150,
                          borderRadius: 150,
                        }}
                        resizeMode="contain"
                      />
                    ) : null}
                  </ImageBackground>
                </TouchableOpacity>
                <Text
                  style={{fontSize: 16, color: '#666666', marginVertical: 10}}>
                  여행자
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => userSelect('resident')}
                  activeOpacity={1}>
                  <ImageBackground
                    source={require('../src/assets/img/btn_user02.png')}
                    style={{
                      position: 'relative',
                      width: 150,
                      height: 150,
                      borderRadius: 150,
                    }}
                    resizeMode="contain">
                    {userDivision == 'resident' ? (
                      <Image
                        source={require('../src/assets/img/btn_user_ck.png')}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: 150,
                          height: 150,
                          borderRadius: 150,
                        }}
                        resizeMode="contain"
                      />
                    ) : null}
                  </ImageBackground>
                </TouchableOpacity>
                <Text
                  style={{fontSize: 16, color: '#666666', marginVertical: 10}}>
                  지역인
                </Text>
              </View>
            </View>
          </View>
        </Content>
      </ScrollView>

      {/* 다음 버튼 */}
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 50,
            marginBottom: 80,
            paddingHorizontal: 20,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => isCancelConfirmBtn()}>
            <Text
              style={{
                borderWidth: 1,
                borderColor: '#E3E3E3',
                backgroundColor: 'transparent',
                paddingHorizontal: 40,
                paddingVertical: 15,
                borderRadius: 30,
                fontSize: 18,
                color: '#E3E3E3',
              }}>
              이전
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={
              ut_join_type === 'password' || ut_join_type === undefined
                ? onSubmit
                : onSocialSubmit
            }>
            <Text
              style={{
                backgroundColor: '#4A26F4',
                paddingHorizontal: 40,
                paddingVertical: 15,
                borderRadius: 30,
                fontSize: 18,
                color: '#fff',
              }}>
              다음
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default RegisterStep02Screen;
