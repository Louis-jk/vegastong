import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {Content, Thumbnail} from 'native-base';
import {
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native-gesture-handler';
import Config from 'react-native-config';

import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {setToken, setDrawer} from '../Module/Reducer';
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
import {
  DrawerContentScrollView,
  useIsDrawerOpen,
} from '@react-navigation/drawer';

const BASE_URL = Config.BASE_URL;

const DrawerMenu = (props) => {
  const navigation = props.navigation;

  const [isToken, setUserToken] = useState(null);

  const getToken = async () => {
    await AsyncStorage.getItem('@vegasTongToken', (err, result) => {
      if (err) {
        console.log('문제가 있습니다. : ', err);
      }
      if (result) {
        dispatch(setToken(result));
        setUserToken(result);
      }
      if (result === null) {
        console.log('토큰값이 없습니다. :', result);
      }
    });
  };

  // Redux 연결
  const dispatch = useDispatch();
  const isDrawer = useSelector((state) => state.Reducer.isDrawer);
  const token = useSelector((state) => state.Reducer.token);
  const {ut_nickname, ut_image} = useSelector((state) => state.UserInfoReducer);
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    if (ut_nickname !== null || ut_image !== null) {
      setUser(ut_nickname);
      setUserImage(ut_image);
    }

    return () => {
      setUser();
    };
  }, [token, ut_nickname, ut_image]);

  const logOutHandle = () => {
    AsyncStorage.clear().then(dispatch(setToken('')));
    setUser('');
    setUserToken(null);
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

  const goToLogin = () => {
    navigation.navigate('login');
  };

  const setCloseDrawer = () => {
    dispatch(setDrawer(false));
    navigation.closeDrawer();
  };
  const LEFTBUTTON = Dimensions.get('window').width * 0.15;
  // console.log('w', parseInt(LEFTBUTTON));

  const [pressColor, setPressColor] = useState('#222222');

  return (
    <>
      {useIsDrawerOpen() && (
        <View
          style={{
            position: 'absolute',
            left: -LEFTBUTTON - 7,
          }}>
          <TouchableOpacity onPress={setCloseDrawer}>
            <ImageBackground
              source={require('../src/assets/img/menu_bg.png')}
              style={{
                backgroundColor: '#4A26F4',
                width: 70,
                height: 60,
                borderBottomLeftRadius: 10,
                elevation: 10,
                zIndex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../src/assets/img/_ic_del_small.png')}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                }}
              />
            </ImageBackground>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView>
        <View style={styles.drawerHeadArea}>
          {/* 드로어메뉴(Drawer) 닫기 버튼 */}

          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            {token ? (
              <TouchableOpacity onPress={logOutHandle}>
                <Text
                  style={{
                    alignSelf: 'flex-end',
                    fontSize: 18,
                    color: '#fff',
                    textDecorationLine: 'underline',
                    marginBottom: 20,
                    marginRight: 15,
                  }}>
                  로그아웃
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Text
                  style={{
                    alignSelf: 'flex-end',
                    fontSize: 18,
                    color: '#fff',
                    textDecorationLine: 'underline',
                    marginBottom: 20,
                    marginRight: 15,
                  }}>
                  로그인
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('home')}>
              <Text
                style={{
                  alignSelf: 'flex-end',
                  fontSize: 18,
                  color: '#C3B7FF',
                  textDecorationLine: 'underline',
                  marginBottom: 20,
                }}>
                홈으로
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.flexRow}>
            {user ? (
              userImage ? (
                <Thumbnail
                  source={{
                    uri: `${BASE_URL}${userImage}`,
                  }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 80,
                    marginRight: 15,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Thumbnail
                  source={require('../src/assets/img/pr_no_img.png')}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 80,
                    marginRight: 15,
                  }}
                  resizeMode="cover"
                /> // require('../src/assets/img/pr_no_img.png')
              )
            ) : (
              <Thumbnail
                source={require('../src/assets/img/pr_no_img.png')}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 80,
                  marginRight: 15,
                }}
                resizeMode="cover"
              />
            )}
            <View>
              {user ? (
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: 5,
                    color: '#fff',
                  }}>
                  {user}님
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: 5,
                    color: '#fff',
                  }}>
                  사용자님
                </Text>
              )}

              <Text style={{fontSize: 16, color: '#C3B7FF'}}>
                오늘도 행복하세요!
              </Text>
            </View>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor="#FFF8E4"
            onPress={() => {
              user
                ? navigation.navigate('userEdit', {
                    title: '정보수정',
                    props: user,
                  })
                : Alert.alert('로그인이 필요합니다.', '로그인 페이지로 이동', [
                    {
                      text: '확인',
                      onPress: () => navigation.navigate('login'),
                    },
                    {
                      text: '취소',
                    },
                  ]);
            }}
            style={styles.drawerMenuArea}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: Dimensions.get('window').width,
                paddingVertical: 13,
                paddingHorizontal: 20,
              }}>
              <Image
                source={require('../src/assets/img/menu_ic01.png')}
                style={styles.drawerMenuAreaImage}
                resizeMode="contain"
              />
              <Text style={[styles.drawerMenuAreaText, {color: pressColor}]}>
                정보수정
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor="#FFF8E4"
            onPress={() => navigation.navigate('notice', {title: '공지사항'})}
            style={styles.drawerMenuArea}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: Dimensions.get('window').width,
                paddingVertical: 13,
                paddingHorizontal: 20,
              }}>
              <Image
                source={require('../src/assets/img/menu_ic02.png')}
                style={styles.drawerMenuAreaImage}
                resizeMode="contain"
              />
              <Text style={styles.drawerMenuAreaText}>공지사항</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor="#FFF8E4"
            onPress={() =>
              user
                ? navigation.navigate('userReply', {title: '내가 쓴 댓글'})
                : Alert.alert('로그인이 필요합니다.', '로그인 페이지로 이동', [
                    {
                      text: '확인',
                      onPress: () => navigation.navigate('login'),
                    },
                    {
                      text: '취소',
                    },
                  ])
            }
            style={styles.drawerMenuArea}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: Dimensions.get('window').width,
                paddingVertical: 13,
                paddingHorizontal: 20,
              }}>
              <Image
                source={require('../src/assets/img/menu_ic03.png')}
                style={styles.drawerMenuAreaImage}
                resizeMode="contain"
              />
              <Text style={styles.drawerMenuAreaText}>내가 쓴 댓글</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor="#FFF8E4"
            onPress={() =>
              user
                ? navigation.navigate('TalkTalkScreen', {title: '내가 쓴 톡톡'})
                : Alert.alert('로그인이 필요합니다.', '로그인 페이지로 이동', [
                    {
                      text: '확인',
                      onPress: () => navigation.navigate('login'),
                    },
                    {
                      text: '취소',
                    },
                  ])
            }
            style={styles.drawerMenuArea}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: Dimensions.get('window').width,
                paddingVertical: 13,
                paddingHorizontal: 20,
              }}>
              <Image
                source={require('../src/assets/img/menu_ic07.png')}
                style={styles.drawerMenuAreaImage}
                resizeMode="contain"
              />
              <Text style={styles.drawerMenuAreaText}>내가 쓴 톡톡</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor="#FFF8E4"
            onPress={() =>
              user
                ? navigation.navigate('userScrap', {title: '스크랩'})
                : Alert.alert('로그인이 필요합니다.', '로그인 페이지로 이동', [
                    {
                      text: '확인',
                      onPress: () => navigation.navigate('login'),
                    },
                    {
                      text: '취소',
                    },
                  ])
            }
            style={styles.drawerMenuArea}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: Dimensions.get('window').width,
                paddingVertical: 13,
                paddingHorizontal: 20,
              }}>
              <Image
                source={require('../src/assets/img/menu_ic04.png')}
                style={styles.drawerMenuAreaImage}
                resizeMode="contain"
              />
              <Text style={styles.drawerMenuAreaText}>스크랩</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor="#FFF8E4"
            onPress={() => navigation.navigate('storeFaq', {title: '컨시어지'})}
            style={styles.drawerMenuArea}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: Dimensions.get('window').width,
                paddingVertical: 13,
                paddingHorizontal: 20,
              }}>
              <Image
                source={require('../src/assets/img/menu_ic05.png')}
                style={styles.drawerMenuAreaImage}
                resizeMode="contain"
              />
              <Text style={styles.drawerMenuAreaText}>컨시어지</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor="#FFF8E4"
            onPress={() =>
              user
                ? navigation.navigate('userFaq', {
                    title: '1:1문의',
                    token: token,
                  })
                : Alert.alert('로그인이 필요합니다.', '로그인 페이지로 이동', [
                    {
                      text: '확인',
                      onPress: () => navigation.navigate('login'),
                    },
                    {
                      text: '취소',
                    },
                  ])
            }
            style={[styles.drawerMenuArea, {marginBottom: 20}]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: Dimensions.get('window').width,
                paddingVertical: 13,
                paddingHorizontal: 20,
              }}>
              <Image
                source={require('../src/assets/img/menu_ic06.png')}
                style={styles.drawerMenuAreaImage}
                resizeMode="contain"
              />
              <Text style={styles.drawerMenuAreaText}>1:1문의</Text>
            </View>
          </TouchableHighlight>
        </View>
        {/* <View style={{width: '100%', height: 5, backgroundColor: '#F5F5F5'}} /> */}
        {/* <View style={{paddingVertical: 20, paddingHorizontal: 20}}> */}
        {/* <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginLeft: 10,
              marginBottom: 5
            }}
          >
            기타
          </Text> */}
        <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Terms', {
                navigation,
                title: '사용자 이용약관',
              })
            }>
            <View
              style={{
                borderColor: '#E3E3E3',
                borderWidth: 1,
                borderBottomWidth: 0,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  padding: 15,
                  textAlign: 'center',
                  color: '#666666',
                }}>
                사용자 이용약관
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('InfoCompany', {
                navigation,
                title: '회사소개',
              })
            }>
            <Text
              style={{
                fontSize: 16,
                borderColor: '#E3E3E3',
                borderWidth: 1,
                padding: 15,
                textAlign: 'center',
                color: '#666666',
              }}>
              회사소개
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Privacy', {
                navigation,
                title: '개인정보이용처리방침',
              })
            }>
            <View
              style={{
                borderColor: '#E3E3E3',
                borderWidth: 1,
                borderTopWidth: 0,
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  padding: 15,
                  textAlign: 'center',
                  color: '#666666',
                }}>
                개인정보이용처리방침
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  drawerHeadArea: {
    paddingTop: 25,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4A26F4',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  drawerMenuArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerMenuAreaImage: {
    width: 30,
    height: 30,
    marginRight: 17,
  },
  drawerMenuAreaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
});

export default DrawerMenu;
