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
import Swiper from 'react-native-swiper';

import Config from 'react-native-config';
import {showLocation, Popup} from 'react-native-map-link';

import ScrapButton from '../Common/ScrapButton';
import ReplyCount from '../Common/ReplyCount';
import ReplyForm from '../Common/ReplyForm';
import Reply from '../Reply';
import Header from '../Common/Header';
import {VegasGet, VegasPost} from '../../utils/axios.config';

const BASE_URL = Config.BASE_URL;

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
    VegasGet(`/api/trip/get_trip/${id}`, {headers: {authorization: `${token}`}})
      .then((res) => {
        console.log('trip res : ', res);
        if (res.result === 'success') {
          setTripDetail(res.data);
          setTripDetailFiles(res.data.files);
          setTripDetailContent(JSON.parse(res.data.tr_content));

          if (res.data.tr_stars) {
            setTripStars(res.data.tr_stars);
          } else {
            setTripStars(0);
          }

          if (res.data.my_star && res.data.my_star.st_star) {
            setMyTripStar(res.data.my_star.st_star);
          } else {
            setMyTripStar(0);
          }

          setBenefit(res.data.tr_benefit);
        } else {
          Alert.alert('????????? ???????????????.', '????????? ??????????????????.', [
            {text: '??????', onPress: () => navigation.navigate('home')},
          ]);
        }
      })
      .catch((err) => console.log(err));
  };

  console.log('setTripDetail : ', tripDetail);
  console.log('benefit : ', benefit);

  // ?????? ????????? ?????? ?????? ????????????
  const [replyLists, setReplyLists] = useState([]);
  const getReplyAPI = () => {
    VegasGet(`/api/word/get_words?wo_category=trip&wo_ref_id=${id}&page=1`)
      .then((res) => {
        console.log('Trip get Reply : ', res);
        if (res.result === 'success') {
          setReplyLists(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // ?????? ?????? ????????????
  const [banner, setBanner] = useState(null);
  const getBannerAPI = () => {
    if (
      tripDetail.tr_category === 'downtown' ||
      tripDetail.tr_category === 'tour' ||
      tripDetail.tr_category === 'hotel'
    ) {
      let selectBanner = '';

      if (tripDetail.tr_category === 'downtown') {
        selectBanner = 'banner3';
      }
      if (tripDetail.tr_category === 'tour') {
        selectBanner = 'banner4';
      }
      if (tripDetail.tr_category === 'hotel') {
        selectBanner = 'banner5';
      }

      VegasGet(`/api/banner/get_location_banners/${selectBanner}`, {
        headers: {authorization: `${token}`},
      })
        .then((res) => {
          if (res.result === 'success') {
            console.log('banner ?', res);
            // setCurationLists(res.data)
            setBanner(res.data[0]);
          }
        })
        .catch((err) => console.log(err));
    } else {
      return false;
    }
  };

  useEffect(() => {
    getApi();
    getReplyAPI();
  }, []);

  useEffect(() => {
    if (tripDetail) {
      getBannerAPI();

      return () => getBannerAPI();
    }
  }, [tripDetail]);

  const toggleScrap = () => {
    if (tripDetail.my_scrap === 0 || tripDetail.my_scrap === null) {
      VegasPost(
        '/api/user/add_scrap',
        qs.stringify({
          sc_category: 'trip',
          sc_ref_id: id,
        }),
        {headers: {authorization: `${token}`}},
      )
        .then((res) => {
          console.log('????????? ?????? ?????? ??? : ', res);
          if (res.result === 'success') {
            getApi();
          }
        })
        .catch((err) => console.log(err));
    } else if (tripDetail.my_scrap !== 0 || tripDetail.my_scrap !== null) {
      VegasPost(
        `/api/user/remove_scrap/${tripDetail.my_scrap.sc_id}`,
        {},
        {headers: {authorization: `${token}`}},
      )
        .then((res) => {
          console.log('Remove Scrap : ', res);
          if (res.result === 'success') {
            getApi();
          }
        })
        .catch((err) => console.log(err));
    } else {
      return false;
    }
  };

  const DelOK = (e) => {
    VegasGet(`/api/word/remove_word/${e}`, {
      headers: {authorization: `${token}`},
    })
      .then((res) => {
        if (res.result === 'success') {
          Alert.alert(
            '???????????? ????????? ?????????????????????.',
            '??? ???????????? ?????????????????????????',
            [
              {
                text: '????????????',
                onPress: () => {
                  getApi();
                  getReplyAPI();
                },
              },
              {
                text: '?????????',
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
      '????????? ?????? ?????????????????????????',
      '????????? ????????? ???????????? ????????????.',
      [
        {text: '??????', onPress: () => DelOK(e)},
        {text: '??????', onPress: () => {}},
      ],
    );
  };

  // ?????? ??????
  const sendRating = (rating) => {
    VegasPost(
      '/api/trip/update_star',
      qs.stringify({
        st_trip_id: id,
        st_star: rating,
      }),
      {headers: {authorization: `${token}`}},
    )
      .then((res) => {
        console.log('trip star result : ', res);
        if (res.result === 'success') {
          setStarCount(res.data);
          Alert.alert(
            '????????? ?????? ??????????????????.',
            '??? ???????????? ?????????????????????????',
            [
              {
                text: '????????????',
                onPress: () => getApi(),
              },
              {
                text: '?????????',
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
      `??? ${rating}?????? ?????????????????????????`,
      '????????? ????????? ??? ??? ????????????.',
      [
        {
          text: '??????',
          onPress: () => sendRating(rating),
        },
        {
          text: '??????',
          onPress: () => {},
        },
      ],
    );
  };

  console.log('tripDetail : ', tripDetail);

  let myWebView;
  const selectLocal = () => {
    // this.webview.postMessage('store');
    myWebView.postMessage('button');
  };

  // ????????????
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
      dialogMessage: '???????????? ?????? ?????? ??????????????????.', // optional (default: 'What app would you like to use?')
      cancelText: '??????', // optional (default: 'Cancel')
      appsWhiteList: ['google-maps', 'kakaomap', 'navermap'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
      naverCallerName: 'com.dmonster.dmonster1427', // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
      // appTitles: {
      //   'google-maps': '????????????',
      //   kakaomap: '????????????',
      //   navermap: '???????????????',
      // }, // optionally you can override default app titles
      // app: 'kakaomap', // optionally specify specific app to use
    });
  };

  return (
    <Container>
      {/* ?????? ?????? */}
      <Modal isVisible={isModalVisible} animationIn="fadeIn">
        <View style={{flex: 1}}>
          {/* ?????? ?????? ???????????? */}

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
            {/* ?????? ????????? */}
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
                  fontSize: 26,
                  color: '#4A26F4',
                  letterSpacing: -2,
                  marginBottom: 2,
                }}>
                ?????? ??????
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#4A26F4',
                }}>
                ????????? ????????? ????????????
              </Text>
            </View>
            {/* //?????? ????????? */}
            {/* ?????? ?????? */}
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
                  : '?????? ????????? ??????????????????.'}
              </Text>

              {/* ?????? ?????? */}
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(toggleModal);
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: '#666666',
                    borderStyle: 'solid',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      paddingHorizontal: 37,
                      paddingVertical: 15,
                    }}>
                    ??????
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(toggleModal);
                  }}
                  style={{
                    backgroundColor: '#4A26F4',
                    borderWidth: 1,
                    borderColor: '#4A26F4',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      paddingHorizontal: 60,
                      paddingVertical: 15,
                    }}>
                    ??????
                  </Text>
                </TouchableOpacity>
              </View>
              {/* //?????? ?????? */}
            </View>
            {/* //?????? ?????? */}
          </View>
          {/* //?????? ?????? ???????????? */}
        </View>
      </Modal>

      {/* ?????? ?????? ?????? */}
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
          dialogMessage: '???????????? ?????? ?????? ??????????????????.', // optional (default: 'What app would you like to use?')
          cancelText: '??????', // optional (default: 'Cancel')
          appsWhiteList: ['apple-maps', 'google-maps', 'kakaomap', 'navermap'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
          naverCallerName: 'com.dmonster.dmonster1427', // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
          // appTitles: {
          //   'google-maps': '????????????',
          //   kakaomap: '????????????',
          //   navermap: '???????????????',
          // }, // optionally you can override default app titles
          // app: 'kakaomap', // optionally specify specific app to use
        }}
        style={{
          titleText: {fontSize: 22, fontWeight: 'bold'},
          subtitleText: {fontSize: 16, color: '#666666'},
          cancelButtonText: {fontSize: 16, color: '#666666'},
        }}
      />
      <Header navigation={navigation} title="???????????????" />

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
                  source={{uri: `${BASE_URL}/${file.ft_file_path}`}}
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
                uri: `${BASE_URL}/${tripDetailFiles[0].ft_file_path}`,
              }}
              resizeMode="cover"
              style={{
                width: width,
                height: height / 2.5,
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
              alignItems: 'flex-start',
              width: '100%',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                backgroundColor: '#4A26F4',
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 10,
                color: '#fff',
                fontSize: 10,
                marginRight: 10,
              }}>
              ??????
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '87%',
              }}>
              <Text textBreakStrategy="simple">{tripDetail.tr_address}</Text>
            </View>
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
                    {tc.title === '????????????' ? (
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(tc.content);
                          // if (tc.content.startsWith('https://')) {
                          //   Linking.openURL(`${tc.content}`)
                          // } else {
                          //   Linking.openURL(`https://${tc.content}`)
                          // }
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            lineHeight: 23,
                            color: '#000',
                            textDecorationLine: 'underline',
                          }}>
                          {tc.content}
                        </Text>
                      </TouchableOpacity>
                    ) : tc.title === '????????????' ? (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:+1${tc.content}`)}>
                        <Text
                          style={{
                            fontSize: 16,
                            lineHeight: 23,
                            color: '#000',
                            textDecorationLine: 'underline',
                          }}>
                          {tc.content}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={{fontSize: 16, lineHeight: 23}}>
                        {tc.content}
                      </Text>
                    )}
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
            <TouchableOpacity
              onPress={() => setLocatePopup(true)}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../src/assets/img/ic_map.png')}
                resizeMode="contain"
                style={{width: 50, height: 50, marginBottom: 10}}
              />
              <Text>????????????</Text>
            </TouchableOpacity>
            {tripDetail.tr_benefit !== '' && tripDetail.tr_benefit !== null && (
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={toggleModal}>
                <Image
                  source={require('../src/assets/img/ic_benefit.png')}
                  resizeMode="contain"
                  style={{width: 50, height: 50, marginBottom: 10}}
                />
                <Text>??????</Text>
              </TouchableOpacity>
            )}
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
                  ? `${userNickName}???, ??? ${myTripStar}??? ???????????????!`
                  : myTripStar >= 1 && myTripStar < 4
                  ? `${userNickName}???, ??? ${myTripStar}???! ?????? ??? ?????????????????????.`
                  : '??? ????????? ?????? ????????? ????????????.'}
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
              ?????? ????????? ????????? ???????????? ??? ????????????.
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
              <Text style={{fontSize: 14, paddingRight: 5}}>??????</Text>
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
      {banner && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Linking.openURL(banner.bn_url)}
          style={{
            width: '100%',
            height: 74,
            bottom: 0,
            zIndex: 100,
            backgroundColor: '#fff',
          }}>
          <Image
            source={{
              uri: banner.ft_download_url,
            }}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Container>
  );
};

export default Detail;
