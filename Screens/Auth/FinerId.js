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
import {Formik} from 'formik';
import * as yup from 'yup';
import {
  joinUserId,
  joinUserNickname,
  joinUserZipcode,
  joinUserAddress,
  joinUserAddressDetail,
  joinUserSocialType,
} from '../Module/JoinReducer';

const baseUrl = 'https://dmonster1826.cafe24.com';

const FinderId = ({navigation, route}) => {
  const title = route.params.title;
  const type = route.params.type;
  const Id = route.params.id;
  console.log('소셜', route);
  const userIdInput = useRef();
  const dispatch = useDispatch();

  // 다음 주소 api 모달 상태관리
  const [postModalView, setPostModalView] = useState(false);

  // 닉네임 체크
  const [checkedNick, setCheckedNick] = useState(false);

  // 회원가입 양식 폼 상태처리
  const [userNick, setUserNickValue] = useState('');
  const [userMobile, setUserMobileValue] = useState('');

  const [textInput, setTextInput] = useState('');
  const [isFocused, setFocus] = useState(false);

  // error 처리
  const [userPwError, setUserPwError] = useState(false);
  const [result, setResult] = useState('');

  // 리셋

  const onResetNick = () => {
    setUserNickValue('');
  };

  const Find = async () => {
    if (userNick !== '' && userMobile !== '') {
      const form = new FormData();
      form.append('ut_nickname', userNick);
      form.append('ut_mobile', userMobile);
      const headers = {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      };
      const api = await axios.post(baseUrl + '/api/user/search_id', form, {
        headers,
      });
      console.log('finder id', api);
      if (api.data.result === 'success') {
        const id = api.data.data.ut_user_id;
        Alert.alert('아이디 찾기', `회원님의 아이디는 ${id} 입니다.`);
      } else {
        Alert.alert('아이디 찾기', api.data.error);
      }
    }
  };

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
  });

  return (
    <Container>
      <ScrollView>
        {/* 다음 주소 api 모달 */}
        <Content>
          {/* 상단 헤더 */}
          <Header navigation={navigation} title={title} />

          {/* 사용자 아이디 입력 */}
          <View style={{marginTop: 30}} />
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 10}}>
              베가스통 아이디찾기
            </Text>
          </View>

          <Formik
            initialValues={{
              register_nickname: '',
              register_mobile: '',
            }}
            onSubmit={async (values, actions) => {
              const form = new FormData();
              form.append('ut_nickname', values.register_nickname);
              form.append('ut_mobile', values.register_mobile);
              const headers = {
                'api-secret':
                  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
              };
              const api = await axios.post(
                baseUrl + '/api/user/search_id',
                form,
                {
                  headers,
                },
              );
              console.log('finder id', api);
              if (api.data.result === 'success') {
                const id = api.data.data.ut_user_id;
                Alert.alert('아이디 찾기', `회원님의 아이디는 ${id} 입니다.`);
              } else {
                Alert.alert('아이디 찾기', api.data.error);
              }

              setTimeout(() => {
                actions.setSubmitting(false);
              }, 1000);
            }}
            validationSchema={validationSchema}>
            {(formikProps) => (
              <>
                <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                  <Text style={{fontSize: 18, marginBottom: 10}}>닉네임</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Input
                      placeholder="닉네임을 입력해주세요"
                      placeholderTextColor="#E3E3E3"
                      style={{
                        borderWidth: 1,
                        borderColor: '#eee',
                        borderRadius: 10,
                        paddingLeft: 10,
                        width: '70%',
                      }}
                      // onChangeText={(text) => setUserNickValue(text)}
                      onChangeText={(value) => {
                        setCheckedNick(false);
                        formikProps.setFieldValue('register_nickname', value);
                      }}
                      autoCapitalize="none"
                      onBlur={formikProps.handleBlur('register_nickname')}
                      autoFocus
                    />
                  </View>
                  {formikProps.touched.register_nickname &&
                  formikProps.errors.register_nickname ? (
                    <Text style={{color: '#4A26F4', marginBottom: 5}}>
                      {formikProps.touched.register_nickname &&
                        formikProps.errors.register_nickname}
                    </Text>
                  ) : null}
                </View>

                <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                  <Text style={{fontSize: 18, marginBottom: 10}}>
                    핸드폰번호 입력
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Input
                      placeholder="번호를 입력해주세요"
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
                      onChangeText={formikProps.handleChange('register_mobile')}
                      keyboardType="number-pad"
                    />
                  </View>
                  {formikProps.touched.register_mobile &&
                  formikProps.errors.register_mobile ? (
                    <Text style={{color: '#4A26F4', marginBottom: 5}}>
                      {formikProps.touched.register_mobile &&
                        formikProps.errors.register_mobile}
                    </Text>
                  ) : null}
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
                    onPress={formikProps.handleSubmit} // () => Find()
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
                      찾기
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default FinderId;
