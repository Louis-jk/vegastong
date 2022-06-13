import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Container, Content} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import BottomTabs from './Common/BottomTabs';
import CompanyInfo from './Common/CompanyInfo';
import axios from 'axios';
import {setKeyword, setTag} from './Module/Reducer';
import InsterFeed from './InsterFeed';
import InstaFeedApi from './InstaFeedApi';

// Redux Reducers function
import {setToken} from './Module/Reducer';

const {window} = Dimensions.get('window');

// const baseUrl = 'https://gongjuro.com'
const baseUrl = 'https://dmonster1826.cafe24.com';

const HomeScreen = ({navigation, route}) => {
  const routeName = route.name;
  const [lists, setLists] = useState([]);

  // Redux 연동
  // const token = useSelector((state) => state.Reducer.token);
  const keyword = useSelector((state) => state.Reducer.keyword);
  const dispatch = useDispatch();

  // 토큰 값 확인
  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@vegasTongToken');
      if (value !== null) {
        dispatch(setToken(value));
        console.log('getToken OK');
      } else {
        console.log('Home Screen AsyncStorage Token is Null');
        navigation.navigate('login');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getToken();

    axios({
      method: 'get',
      url: `${baseUrl}/api/common/get_main`,
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        console.log('res ??', res);
        setLists(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const searchKeyword = (txt) => {
    dispatch(setKeyword(txt));
  };

  const goToSearchTravel = () => {
    dispatch(setTag('travel'));
    navigation.navigate('SearchList', {text: '여행'});
  };
  const goToSearchRestaurant = () => {
    dispatch(setTag('restaurant'));
    navigation.navigate('SearchList', {text: '맛집'});
  };
  const goToSearchCafe = () => {
    dispatch(setTag('cafe'));
    navigation.navigate('SearchList', {text: '카페'});
  };
  const goToSearchShop = () => {
    dispatch(setTag('shop'));
    navigation.navigate('SearchList', {text: '쇼핑'});
  };

  console.log('Home lists', lists);

  return (
    <>
      <Container>
        <View style={styles.main}>
          <Image
            style={{
              width: '30%',
              height: 30,
              resizeMode: 'contain',
            }}
            source={require('./src/assets/img/main_logo.png')}
          />
          <View style={styles.nav}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              activeOpacity={1}
              style={{width: 60, height: 60}}>
              <View>
                <Image
                  style={styles.navBtn}
                  source={require('./src/assets/img/top_ic_menu_bk.png')}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mainSearch}>
          <TextInput
            placeholder="키워드로 검색해보세요!"
            style={styles.textInput}
            placeholderTextColor="#4A26F4"
            onChangeText={(text) => searchKeyword(text)}
            value={keyword}
            onSubmitEditing={() =>
              navigation.navigate('SearchList', {
                text: 'home',
              })
            }
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              width: 50,
              height: 50,
              backgroundColor: '#4A26F4',
              borderRadius: 12,
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SearchList', {
                  text: 'home',
                })
              }>
              <Image
                source={require('./src/assets/img/ic_sch_w.png')}
                style={{
                  marginVertical: 13,
                  marginHorizontal: 13,
                  width: 25,
                  height: 25,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={{backgroundColor: '#fff'}}>
          <Content>
            <View style={{paddingHorizontal: 20}}>
              <View style={styles.contentHashArea}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={goToSearchTravel}
                  activeOpacity={0.8}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    backgroundColor: 'transparent',
                    // borderRadius: 25,
                    // borderColor: '#eaeaea',
                    // borderStyle: 'solid',
                    // borderWidth: 1,
                    marginRight: 5,
                  }}>
                  <Text style={{fontSize: 14, color: '#666666'}}>여행</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={goToSearchRestaurant}
                  activeOpacity={0.8}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    backgroundColor: 'transparent',
                    // borderRadius: 25,
                    // borderColor: '#eaeaea',
                    // borderStyle: 'solid',
                    // borderWidth: 1,
                    marginRight: 5,
                  }}>
                  <Text style={{fontSize: 14, color: '#666666'}}>맛집</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={goToSearchCafe}
                  activeOpacity={0.8}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    backgroundColor: 'transparent',
                    // borderRadius: 25,
                    // borderColor: '#eaeaea',
                    // borderStyle: 'solid',
                    // borderWidth: 1,
                    marginRight: 5,
                  }}>
                  <Text style={{fontSize: 14, color: '#666666'}}>카페</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={goToSearchShop}
                  activeOpacity={0.8}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    backgroundColor: 'transparent',
                    // borderRadius: 25,
                    // borderColor: '#eaeaea',
                    // borderStyle: 'solid',
                    // borderWidth: 1,
                    marginRight: 5,
                  }}>
                  <Text style={{fontSize: 14, color: '#666666'}}>쇼핑</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Pressable
              style={{
                borderWidth: 0.5,
                borderColor: '#CCCCCC',
                marginBottom: 20,
              }}
            />
            <View style={{paddingHorizontal: 20}}>
              <Text style={[styles.contentTitle, {marginBottom: 5}]}>
                🇺🇸 새소식
              </Text>
              {lists && lists.length === 0 && (
                <View
                  style={{
                    minHeight: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>새소식이 없습니다.</Text>
                </View>
              )}
              {lists &&
                lists.length > 0 &&
                lists.map((list) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CurationDetail', {
                        title: '새소식', // list.cu_title
                        id: list.cu_id,
                      })
                    }
                    key={list.cu_id}
                    activeOpacity={0.8}>
                    <View style={{marginVertical: 10}}>
                      <Image
                        source={{
                          uri: `${baseUrl}${list.files[0].ft_file_path}`,
                        }}
                        resizeMode="cover"
                        style={styles.contentListImg}
                      />
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#eee',
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                          padding: 15,
                        }}>
                        <Text
                          style={{
                            flex: 1,
                            flexWrap: 'wrap',
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#222',
                          }}
                          numberOfLines={1}>
                          {list.cu_title}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
            {/* <View style={{marginTop: 20}}> */}
            {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={styles.contentTitle}>INSTARGRAM</Text>
                <Text style={{fontSize: 16, color: '#333'}}>@gongju_ro</Text>
              </View> */}

            {/* <InstaFeedApi /> */}
            {/* </View> */}
          </Content>
          {/* <CompanyInfo navigation={navigation} /> */}
        </ScrollView>
      </Container>
      <BottomTabs navigation={navigation} routeName={routeName} />
    </>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: window,
    height: 250,
    borderBottomRightRadius: 45,
    borderBottomLeftRadius: 45,
    backgroundColor: '#4A26F4',
    marginRight: 20,
  },
  main: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
  },
  mainTextArea: {
    position: 'absolute',
    top: 55,
    left: 20,
  },
  mainText01b: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  mainText01n: {
    fontSize: 30,
    fontWeight: 'normal',
    color: '#fff',
    marginBottom: 5,
  },
  mainText02: {
    fontSize: 20,
    color: '#fff',
    letterSpacing: -1,
  },
  bgImage: {
    position: 'absolute',
    bottom: -22,
    right: -5,
    width: 150,
    height: 200,
    zIndex: 100,
  },
  nav: {
    position: 'absolute',
    top: 0,
    right: 5,
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    color: '#fff',
    zIndex: 1000,
  },
  navBtn: {
    width: 60,
    height: 60,
  },
  mainSearch: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    height: 50,
    paddingLeft: 20,
    backgroundColor: '#E8EBFF',
    borderRadius: 15,
    color: '#4A26F4',
  },
  contentHashArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  contentListImg: {
    width: window,
    height: Dimensions.get('window').width / 2.65,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});

export default HomeScreen;
