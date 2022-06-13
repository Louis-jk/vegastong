import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Button,
  Alert,
  Linking,
} from 'react-native';
import {Container, Content, Thumbnail, Textarea, Form} from 'native-base';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import StarRating from 'react-native-star-rating';
import {WebView} from 'react-native-webview';
import qs from 'qs';
import axios from 'axios';
import Swiper from 'react-native-swiper';
// import KakaoSDK from '@actbase/react-native-kakaosdk';
// import KakaoNavi from '@actbase/react-native-kakao-navi';
// import RNKakaoTest from 'react-native-kakao-test';

import {showLocation, Popup} from 'react-native-map-link';

import ScrapButton from '../Common/ScrapButton';
import ReplyCount from '../Common/ReplyCount';
import ReplyForm from '../Common/ReplyForm';
import Reply from '../Reply';
import Header from '../Common/Header';

const {width} = Dimensions.get('window');

// const baseUrl = 'https://gongjuro.com';
const baseUrl = 'https://dmonster1826.cafe24.com';

const Detail = (props) => {
  const navigation = props.navigation;
  const id = props.route.params.id;
  const {width, height} = Dimensions.get('window');
  const token = useSelector((state) => state.Reducer.token);
  const userNickName = useSelector(
    (state) => state.UserInfoReducer.ut_nickname,
  );

  const [scrap, setScrap] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // const curImg = route.params.props.image;
  // const curTitle = route.params.props.title;
  // const curAvatarProfile = route.params.props.avatar.profile;
  // const curAvatarName = route.params.props.avatar.name;
  const [tripDetail, setTripDetail] = useState([]);
  const [tripDetailFiles, setTripDetailFiles] = useState([]);
  const [tripDetailContent, setTripDetailContent] = useState([]);
  const [tripStars, setTripStars] = useState(0);
  const [myTripStar, setMyTripStar] = useState(0);
  const [benefit, setBenefit] = useState(null);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const getApi = () => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/trip/get_trip/${id}`,
      headers: {
        authorization: token,
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        console.log('trip res : ', res);
        if (res.data.result == 'success') {
          setTripDetail(res.data.data);
          setTripDetailFiles(res.data.data.files);
          setTripDetailContent(JSON.parse(res.data.data.tr_content));
          setTripStars(res.data.data.tr_stars);
          setMyTripStar(res.data.data.my_star.st_star);
          setBenefit(res.data.data.tr_benefit);
        } else {
          Alert.alert('잘못된 경로입니다.', '경로를 확인해주세요.', [
            {text: '확인', onPress: () => navigation.navigate('home')},
          ]);
        }
      })
      .catch((err) => console.log(err));
  };

  console.log('setTripDetail : ', tripDetail);
  console.log('benefit : ', benefit);

  // 해당 페이지 전체 댓글 불러오기
  const [replyLists, setReplyLists] = useState([]);
  const getReplyAPI = () => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/word/get_words`,
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
      params: {
        wo_category: 'trip',
        wo_ref_id: id,
        page: 1,
      },
    })
      .then((res) => {
        console.log('Trip get Reply : ', res);
        if (res.data.result === 'success') {
          setReplyLists(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getApi();
    getReplyAPI();
  }, []);

  const toggleScrap = () => {
    if (tripDetail.my_scrap === 0 || tripDetail.my_scrap === null) {
      axios({
        method: 'post',
        url: `${baseUrl}/api/user/add_scrap`,
        headers: {
          authorization: token,
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
        data: qs.stringify({
          sc_category: 'trip',
          sc_ref_id: id,
        }),
      })
        .then((res) => {
          console.log('스크랩 기능 추가 값 : ', res);
          if (res.data.result === 'success') {
            getApi();
          }
        })
        .catch((err) => console.log(err));
    } else if (tripDetail.my_scrap !== 0 || tripDetail.my_scrap !== null) {
      axios({
        method: 'post',
        url: `${baseUrl}/api/user/remove_scrap/${tripDetail.my_scrap.sc_id}`,
        headers: {
          authorization: token,
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
      })
        .then((res) => {
          console.log('Remove Scrap : ', res);
          if (res.data.result === 'success') {
            getApi();
          }
        })
        .catch((err) => console.log(err));
    } else {
      return false;
    }
  };

  const DelOK = (e) => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/word/remove_word/${e}`,
      headers: {
        authorization: token,
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        if (res.data.result === 'success') {
          Alert.alert(
            '작성하신 댓글이 삭제되었습니다.',
            '이 페이지에 머무르시겠습니까?',
            [
              {
                text: '머무르기',
                onPress: () => {
                  getApi();
                  getReplyAPI();
                },
              },
              {
                text: '나가기',
                onPress: () => navigation.navigate('home'),
              },
            ],
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const ReplyDel = (e) => {
    Alert.alert(
      '댓글을 정말 삭제하시겠습니까?',
      '삭제된 댓글은 복원되지 않습니다.',
      [
        {text: '삭제', onPress: () => DelOK(e)},
        {text: '취소', onPress: () => {}},
      ],
    );
  };

  // 별점 주기
  const sendRating = (rating) => {
    axios({
      method: 'post',
      url: `${baseUrl}/api/trip/update_star`,
      headers: {
        authorization: token,
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
      data: qs.stringify({
        st_trip_id: id,
        st_star: rating,
      }),
    })
      .then((res) => {
        console.log('trip star result : ', res);
        if (res.data.result === 'success') {
          setStarCount(res.data.data);
          Alert.alert(
            '소중한 평가 감사드립니다.',
            '이 페이지에 머무르시겠습니까?',
            [
              {
                text: '머무르기',
                onPress: () => getApi(),
              },
              {
                text: '나가기',
                onPress: () => navigation.navigate('trip'),
              },
            ],
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const [starCount, setStarCount] = useState(1);
  const onStarRatingPress = (rating) => {
    setStarCount(rating);
    Alert.alert(
      `별 ${rating}개를 전송하시겠습니까?`,
      '전송시 수정을 할 수 없습니다.',
      [
        {
          text: '전송',
          onPress: () => sendRating(rating),
        },
        {
          text: '취소',
          onPress: () => {},
        },
      ],
    );
  };

  console.log('tripDetail : ', tripDetail);
  console.log('tripDetailContent 값 : ', tripDetailContent);

  // const destination = {
  //   name: '카카오판교오피스',
  //   x: 321286,
  //   y: 533707,
  // };

  // const options = {
  //   coordType: CoordType.WGS84,
  //   vehicleType: VehicleType.Second,
  //   rpoption: RpOption.HighWay,
  //   routeInfo: false,
  //   startX: 321286,
  //   startY: 533707,
  //   startAngle: 0,
  //   userId: 'asdf',
  //   returnUri: 'localhost',
  // };

  // const viaList = [
  //   {
  //     name: '카카오판교오피스',
  //     x: 321286,
  //     y: 533707,
  //   },
  //   {
  //     name: '카카오판교오피스',
  //     x: 321286,
  //     y: 533707,
  //   },
  //   {
  //     name: '카카오판교오피스',
  //     x: 321286,
  //     y: 533707,
  //   },
  // ];

  // const linkLocation = () => {
  //   KakaoSDK.Navi.navigate(destination, options, viaList)
  //     .then((res) => console.log(res))
  //     .catch((e) => console.log(e));
  // };
  let myWebView;
  const selectLocal = () => {
    // this.webview.postMessage('store');
    myWebView.postMessage('button');
  };

  // 위치공유
  const [isLocatePopup, setLocatePopup] = useState(false);
  const goToLocation = () => {
    showLocation({
      latitude: tripDetail.tr_lat,
      longitude: tripDetail.tr_lng,
      // sourceLatitude: -8.0870631, // optionally specify starting location for directions
      // sourceLongitude: -34.8941619, // not optional if sourceLatitude is specified
      title: tripDetail.tr_name, // optional
      googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
      // googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58', // optionally specify the google-place-id
      // alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
      dialogTitle: tripDetail.tr_name, // optional (default: 'Open in Maps')
      dialogMessage: '사용하실 지도 앱을 선택해주세요.', // optional (default: 'What app would you like to use?')
      cancelText: '취소', // optional (default: 'Cancel')
      appsWhiteList: ['google-maps', 'kakaomap', 'navermap'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
      naverCallerName: 'com.dmonster.dmonster1427', // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
      // appTitles: {
      //   'google-maps': '구글지도',
      //   kakaomap: '카카오맵',
      //   navermap: '네이버지도',
      // }, // optionally you can override default app titles
      // app: 'kakaomap', // optionally specify specific app to use
    });
  };

  // const destination = {
  //   name: tripDetail.tr_name,
  //   x: tripDetail.tr_lat,
  //   y: tripDetail.tr_lng,
  // };

  // const options: ARNKakaoNaviOptions  = {
  //   coordType: CoordType.WGS84,
  //   vehicleType: VehicleType.Second,
  //   rpoption: RpOption.Highway,
  //   routeInfo: false,
  //   startX: 321286,
  //   startY: 533707,
  //   startAngle: 0,
  //   userId: tripDetail.tr_id,
  //   returnUri: 'https://dmonster1826.cafe24.com/',
  // };

  // const viaList = [
  //   {
  //     name: tripDetail.tr_name,
  //     x: tripDetail.tr_lat,
  //     y: tripDetail.tr_lng,
  //   },
  // ];

  const goToNavi = () => {
    // KakaoNavi.share(destination);
    KakaoSDK.Navi.share(
      {
        name: tripDetail.tr_name,
        x: tripDetail.tr_lat,
        y: tripDetail.tr_lng,
      },
      {
        coordType: CoordType.WGS84,
        vehicleType: VehicleType.Second,
        rpoption: RpOption.Highway,
        routeInfo: false,
        startX: 321286,
        startY: 533707,
        startAngle: 0,
        userId: tripDetail.tr_id,
        returnUri: 'https://dmonster1826.cafe24.com/',
      },
      viaList?.map((v) => ({
        name: v?.name,
        x: String(v?.x),
        y: String(v?.y),
      })) || [],
    )
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  /*
export const share = (location, options = {}, viaList = []) => {
  if (!location) {
    console.error('Cannot call the ANKakaoNavi.share with ' + location + ' location');
  } else if (viaList.length > 3) {
    console.error('viaList must be <=3');
  } else {
    return ARNKakaoNavi.share(
      {
        name: location?.name,
        x: String(location?.x),
        y: String(location?.y),
      },
      options,
      viaList?.map((v) => ({
        name: v?.name,
        x: String(v?.x),
        y: String(v?.y),
      })) || [],
    );
  }
};
  */

  return (
    <Container>
      {/* 모달 설정 */}
      <Modal isVisible={isModalVisible} animationIn="fadeIn">
        <View style={{flex: 1}}>
          {/* 모달 전체 레이아웃 */}

          <View
            style={{
              backgroundColor: 'transparent',
              borderRadius: 15,
              marginHorizontal: 10,
              marginTop: 100,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../src/assets/img/event_top.png')}
                resizeMode="contain"
                style={{
                  width: 200,
                  height: 100,
                  backgroundColor: 'transparent',
                }}
              />
            </View>
            {/* 모달 타이틀 */}
            <View
              style={{
                backgroundColor: '#E8EBFF',
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                paddingVertical: 25,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 30,
                  color: '#4A26F4',
                  letterSpacing: -2,
                  marginBottom: 2,
                }}>
                혜택 내용
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 22,
                  color: '#4A26F4',
                }}>
                다양한 혜택을 누리세요
              </Text>
            </View>
            {/* //모달 타이틀 */}
            {/* 모달 내용 */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                paddingVertical: 20,
                paddingHorizontal: 20,
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  lineHeight: 22,
                  marginVertical: 20,
                }}>
                {tripDetail.tr_benefit
                  ? tripDetail.tr_benefit
                  : '현재 혜택을 준비중입니다.'}
              </Text>

              {/* 모달 버튼 */}
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#F8F8F8',
                  marginVertical: 20,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(toggleModal);
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#666666',
                      borderStyle: 'solid',
                      borderRadius: 30,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        paddingHorizontal: 35,
                        paddingVertical: 15,

                        marginHorizontal: 10,
                      }}>
                      닫기
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(toggleModal);
                  }}
                  style={{
                    backgroundColor: '#4A26F4',
                    marginHorizontal: 10,
                    borderRadius: 30,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      paddingHorizontal: 60,
                      paddingVertical: 15,
                    }}>
                    확인
                  </Text>
                </TouchableOpacity>
              </View>
              {/* //모달 버튼 */}
            </View>
            {/* //모달 내용 */}
          </View>
          {/* //모달 전체 레이아웃 */}
        </View>
      </Modal>

      {/* 위치 공유 팝업 */}
      <Popup
        isVisible={isLocatePopup}
        onCancelPressed={() => setLocatePopup(false)}
        onAppPressed={() => setLocatePopup(false)}
        onBackButtonPressed={() => setLocatePopup(false)}
        modalProps={{
          // you can put all react-native-modal props inside.
          animationIn: 'slideInUp',
        }}
        appsWhiteList={['google-maps', 'kakaomap']}
        // appTitles: {{ /* Optional: you can override app titles. */ }}
        options={{
          latitude: tripDetail.tr_lat,
          longitude: tripDetail.tr_lng,
          // sourceLatitude: -8.0870631, // optionally specify starting location for directions
          // sourceLongitude: -34.8941619, // not optional if sourceLatitude is specified
          title: tripDetail.tr_name, // optional
          googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
          // googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58', // optionally specify the google-place-id
          // alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
          dialogTitle: tripDetail.tr_name, // optional (default: 'Open in Maps')
          dialogMessage: '사용하실 지도 앱을 선택해주세요.', // optional (default: 'What app would you like to use?')
          cancelText: '취소', // optional (default: 'Cancel')
          appsWhiteList: ['apple-maps', 'google-maps', 'kakaomap', 'navermap'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
          naverCallerName: 'com.dmonster.dmonster1427', // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
          // appTitles: {
          //   'google-maps': '구글지도',
          //   kakaomap: '카카오맵',
          //   navermap: '네이버지도',
          // }, // optionally you can override default app titles
          // app: 'kakaomap', // optionally specify specific app to use
        }}
        style={{
          titleText: {fontSize: 22, fontWeight: 'bold'},
          subtitleText: {fontSize: 16, color: '#666666'},
          cancelButtonText: {fontSize: 16, color: '#666666'},
        }}
      />
      <Header navigation={navigation} title="베가스여행" />
      {/* <View
        style={{
          position: 'absolute',
          top: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.2)',
          paddingHorizontal: 10,
          width: '100%'
        }}
      >
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('../src/assets/img/top_ic_history_w.png')}
              resizeMode='contain'
              style={{ width: 25, height: 25, marginRight: 10 }}
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 18
              }}
            >
              베가스여행
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={require('../src/assets/img/top_ic_menu.png')}
              resizeMode='contain'
              style={{ width: 60, height: 60 }}
            />
          </TouchableOpacity>
        </View>
      </View> */}

      <ScrollView style={{backgroundColor: '#fff'}}>
        <View style={{position: 'relative'}}>
          {tripDetailFiles.length > 1 ? (
            <Swiper
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: height / 2.5,
              }}
              dotColor="#rgba(255,255,255,0.7)"
              activeDotColor="#4A26F4">
              {tripDetailFiles.map((file) => (
                <Image
                  key={file.ft_id}
                  source={{uri: `${baseUrl}/${file.ft_file_path}`}}
                  resizeMode="cover"
                  style={{
                    width: width,
                    height: height / 2.5,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    alignSelf: 'center',
                  }}
                />
              ))}
            </Swiper>
          ) : tripDetailFiles.length == 1 ? (
            <Image
              source={{
                uri: `${baseUrl}/${tripDetailFiles[0].ft_file_path}`,
              }}
              resizeMode="cover"
              style={{
                width: width,
                height: height / 2.5,
                // borderBottomLeftRadius: 10,
                // borderBottomRightRadius: 10,
                alignSelf: 'center',
              }}
            />
          ) : null}
        </View>
        <Content style={{paddingHorizontal: 20}}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginVertical: 20,
            }}>
            {tripDetail.tr_name}
          </Text>

          <View
            style={{
              borderBottomColor: '#EFEFEF',
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text
              style={{
                backgroundColor: '#4A26F4',
                paddingVertical: 5,
                paddingHorizontal: 7,
                borderRadius: 10,
                color: '#fff',
                fontSize: 10,
                marginRight: 10,
              }}>
              도로명
            </Text>
            <Text style={{marginVertical: 20}}>{tripDetail.tr_address}</Text>
          </View>
          <View
            style={{
              borderBottomColor: '#EFEFEF',
              borderBottomWidth: 1,
            }}
          />
          <View style={{marginVertical: 15}}>
            {tripDetailContent.length !== 0
              ? tripDetailContent.map((tc, idx) => (
                  <View style={{marginVertical: 7}} key={`${tc.title}-${idx}`}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#4A26F4',
                        marginBottom: 7,
                      }}>
                      {tc.title}
                    </Text>
                    <Text style={{fontSize: 16, lineHeight: 23}}>
                      {tc.content}
                    </Text>
                  </View>
                ))
              : null}
          </View>
          <View
            style={{
              borderBottomColor: '#EFEFEF',
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 30,
            }}>
            {/* <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../src/assets/img/cont_ic01.png')}
                resizeMode="contain"
                style={{width: 50, height: 50}}
              />
              <Text>네비게이션</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => setLocatePopup(true)}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../src/assets/img/ic_map.png')}
                resizeMode="contain"
                style={{width: 50, height: 50, marginBottom: 10}}
              />
              <Text>위치공유</Text>
              <WebView
                ref={(el) => (myWebView = el)}
                source={{
                  uri: 'https://dmonster1826.cafe24.com/home/kakao_link',
                }}
                style={{flex: 1}}
                onMessage={(e) => console.log(e.nativeEvent.data)}
                onShouldStartLoadWithRequest={(event) => {
                  if (event.url !== uri) {
                    Linking.openURL(event.url);
                    return false;
                  }
                }}
              />
              {/* url + /v-store */}
            </TouchableOpacity>
            {tripDetail.tr_category === 'store' ? (
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={toggleModal}>
                <Image
                  source={require('../src/assets/img/cont_ic03.png')}
                  resizeMode="contain"
                  style={{width: 50, height: 50, marginBottom: 10}}
                />
                <Text>혜택</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </Content>
        <Content>
          <View style={{position: 'relative', width: width, marginBottom: 30}}>
            <ImageBackground
              source={require('../src/assets/img/text_bg.png')}
              resizeMode="center"
              style={{
                backgroundColor: 'transparent',
                width: width,
                height: 135,
                borderBottomLeftRadius: 60,
                borderTopLeftRadius: 60,
              }}
            />
            {/* <Image
              source={require('../src/assets/img/cont_img01.png')}
              style={{
                position: 'absolute',
                top: 20,
                left: -15,
                width: 200,
                height: 160,
              }}
              resizeMode="contain"
            /> */}
            <Text
              style={{
                position: 'absolute',
                top: 30,
                right: 30,
                width: 270,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#1B0488',
                textAlign: 'right',
                lineHeight: 26,
              }}>
              {tripDetail.tr_message}
            </Text>
          </View>
        </Content>
        {token ? (
          <ScrapButton
            scrap={tripDetail.my_scrap}
            toggleScrap={toggleScrap}
            id={id}
          />
        ) : null}
        <View>
          {token ? (
            <View style={{marginTop: 30, marginBottom: 20}}>
              <Text
                style={{fontSize: 18, textAlign: 'center', color: '#A0A0A0'}}>
                {myTripStar >= 4
                  ? `${userNickName}님, 별 ${myTripStar}개 감사합니다!`
                  : myTripStar >= 1 && myTripStar < 4
                  ? `${userNickName}님, 별 ${myTripStar}개! 더욱 더 노력하겠습니다.`
                  : '이 글에 대한 평가를 해주세요.'}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <StarRating
                  disabled={false}
                  emptyStar={require('../src/assets/img/star_off.png')}
                  fullStar={require('../src/assets/img/star_on.png')}
                  maxStars={5}
                  rating={myTripStar || starCount}
                  selectedStar={
                    myTripStar
                      ? () => {
                          return false;
                        }
                      : (rating) => onStarRatingPress(rating)
                  }
                  starSize={50}
                />
              </View>
            </View>
          ) : null}
        </View>
        <View style={{paddingHorizontal: 20}}>
          {token ? (
            <ReplyForm
              wo_ref_id={id}
              wo_category="trip"
              navigation={navigation}
              getReplyAPI={getReplyAPI}
              getApi={getApi}
            />
          ) : (
            <Text
              style={{
                fontSize: 16,
                color: '#666666',
                marginTop: 25,
                textAlign: 'center',
              }}>
              댓글 작성은 회원만 이용하실 수 있습니다.
            </Text>
          )}
        </View>

        <View style={{paddingHorizontal: 20, marginTop: 40}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <ReplyCount count={tripDetail.wo_count} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 14, paddingRight: 5}}>평점</Text>
              <Text style={{fontSize: 20, paddingRight: 10}}>
                {!tripStars ? 0 : tripStars}
              </Text>

              <StarRating
                disabled={false}
                emptyStar={require('../src/assets/img/star_s_off.png')}
                fullStar={require('../src/assets/img/star_s_on.png')}
                maxStars={5}
                rating={Math.floor(tripStars)}
                starSize={25}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#EFEFEF',
            borderBottomWidth: 1,
          }}
        />
        <View>
          <Reply
            ReplyDel={ReplyDel}
            replyLists={replyLists}
            getReplyAPI={getReplyAPI}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

export default Detail;
