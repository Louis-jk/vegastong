import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Share,
  Pressable,
} from 'react-native';
import {Container, Content} from 'native-base';
import AutoHeightWebView from 'react-native-autoheight-webview';
import qs from 'qs';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';

// import KakaoSDK from '@actbase/react-native-kakaosdk';
// import RNKakaoTest from 'react-native-kakao-test';
import Header from '../Common/Header';
import ScrapButton from '../Common/ScrapButton';
import ShareButton from '../Common/ShareButton';
import ReplyCount from '../Common/ReplyCount';
import ReplyForm from '../Common/ReplyForm';
import Reply from '../Reply';
import {VegasGet, VegasPost} from '../../utils/axios.config';

const CurationDetail = (props) => {
  const navigation = props.navigation;
  const title = props.route.params.title;
  const cuId = props.route.params.id;

  const [isScrapModalVisible, setScrapModalVisible] = useState(false);
  const token = useSelector((state) => state.Reducer.token);
  const utId = useSelector((state) => state.UserInfoReducer.utId);

  const toggleScrapModal = () => setScrapModalVisible(!isScrapModalVisible);

  const [share, setShare] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(false);

  const toggleShare = () => setShare(!share);
  const toggleShareModal = () => setShareModalVisible(!isShareModalVisible);

  const dispatch = useDispatch();

  // 새소식 상세페이지 불러오기
  const [curationLists, setCurationLists] = useState([]);
  const containerRef = useRef(null);

  const getApi = () => {
    VegasGet(`/api/curation/get_curation/${cuId}`, {
      headers: {authorization: `${token}`},
    })
      .then((res) => {
        if (res.result === 'success') {
          setCurationLists(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  console.log('curationLists : ', curationLists);

  // 해당 페이지 전체 댓글 불러오기
  const [replyLists, setReplyLists] = useState([]);
  const getReplyAPI = () => {
    VegasGet(
      `/api/word/get_words?wo_category=curation&wo_ref_id=${cuId}&page=1`,
    )
      .then((res) => {
        if (res.result === 'success') {
          setReplyLists(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // 내 스크랩 불러오기
  const [myScraps, setMyScraps] = useState([]);
  const getMyScrap = () => {
    VegasPost(
      '/api/user/get_my_scraps',
      {},
      {headers: {authorization: `${token}`}},
    )
      .then((res) => {
        if (res.result === 'success') {
          // setMyScraps(res.data.scraps); 수정
          const matchedScrap = res.data.scraps.find(
            (ms) => ms.sc_curation_id == cuId,
          );
          if (matchedScrap.length !== 0) {
            setScrap(true);
            setMyScraps(matchedScrap);
          } else {
            setScrap(false);
          }
        } else {
          return false;
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    containerRef.current?._root.scrollToPosition(0, 0);
    getApi();
    getReplyAPI();
  }, [cuId]);

  console.log('myScraps', myScraps);

  // 스크랩 온/오프
  const [scrap, setScrap] = useState(false);

  const toggleScrap = () => {
    if (curationLists.my_scrap === 0 || curationLists.my_scrap === null) {
      VegasPost(
        '/api/user/add_scrap',
        qs.stringify({
          sc_category: 'curation',
          sc_ref_id: cuId,
        }),
        {headers: {authorization: `${token}`}},
      )
        .then((res) => {
          if (res.result === 'success') {
            getApi();
          }
        })
        .catch((err) => console.log(err));
    } else if (
      curationLists.my_scrap !== 0 ||
      curationLists.my_scrap !== null
    ) {
      VegasPost(
        `/api/user/remove_scrap/${curationLists.my_scrap.sc_id}`,
        {},
        {headers: {authorization: `${token}`}},
      )
        .then((res) => {
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

  const favorLoginInfo = () => {
    Alert.alert('회원만 이용하실 수 있습니다.', '로그인 하시겠습니까?', [
      {
        text: '확인',
        onPress: () => navigation.navigate('login'),
      },
      {
        text: '취소',
        onPress: () => {},
      },
    ]);
  };

  const addLikeBtn = () => {
    VegasPost(
      '/api/curation/toggle_favor/',
      qs.stringify({
        cuId,
      }),
      {headers: {authorization: `${token}`}},
    )
      .then((res) => {
        if (res.result === 'success') {
          getApi();
        }
      })
      .catch((err) => console.log(err));
  };

  // const shareKakao = () => {
  //   RNKakaoTest.link((result) => console.log(result));
  // };

  // Platform IOS (공유하기)
  const linkCustom = async () => {
    try {
      const result = await Share.share({
        title: '베가스통',
        message: `베가스통의 새소식을 공유합니다! 링크: https://dmonster1826.cafe24.com/home/curation_link?cu_id=${cuId}`,
        // url: `intent://curation_detail/${title}/${cuId}/#Intent; scheme=vegastong; package=com.dmonster.vegastong;`,
        url: `https://dmonster1826.cafe24.com/home/curation_link?cu_id=${cuId}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const onWebViewMessage = (evt) => {
    console.log('evt.nativeEvent.data?', evt.nativeEvent.data);
    console.log('evt.nativeEvent.data Height?', evt.nativeEvent.data.height);
  };

  // console.log('curationLists ?', curationLists);

  return (
    <Container>
      <Header navigation={navigation} title={title} />

      <Content ref={containerRef}>
        <View style={{paddingHorizontal: 20, marginTop: 10}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', paddingBottom: 10}}>
            {curationLists.cu_title}
          </Text>
          <Text style={{fontSize: 16, color: '#666666'}}>
            {moment(curationLists.ar_updated_at).format('YYYY/MM/DD')}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#EFEFEF',
            marginVertical: 20,
          }}
        />

        <AutoHeightWebView
          source={{
            html: `<style>img {max-width: 100%;}</style>${curationLists.cu_content}`,
          }}
          style={{
            width: Dimensions.get('window').width,
            // marginHorizontal: 20,
            marginBottom: 50,
          }}
          customScript={"document.body.style.background = 'transparent';"}
          customStyle={`
            * {
              padding: 0;
              margin: 0;
            }
            body {
              padding: 0 20px;
            }
            img {
              // display: block; 
              max-width: 100% !important; 
              height: auto !important;
              object-fit: contain;
            }
          `}
          // onSizeUpdated={(size) => console.log(size.height)}
          files={[
            {
              href: 'cssfileaddress',
              type: 'text/css',
              rel: 'stylesheet',
            },
          ]}
          scalesPageToFit={false}
          viewportContent="width=device-width, user-scalable=no"
          onMessage={onWebViewMessage}
        />
        {curationLists.cu_link_id !== null ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TripDetail', {
                id: curationLists.cu_link_id,
              })
            }
            style={{
              backgroundColor: '#F8F8F8',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 15,
              marginHorizontal: 20,
              borderRadius: 10,
              marginBottom: 50,
            }}>
            <Text style={{color: '#4A26F4'}}>자세히보기</Text>
          </TouchableOpacity>
        ) : null}
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {token ? (
            <ScrapButton
              scrap={curationLists.my_scrap}
              toggleScrap={toggleScrap}
              id={cuId}
            />
          ) : null}
          <View style={{width: 10}} />
          <ShareButton
            toggleShareModal={toggleShareModal}
            // shareKakao={Platform.OS === 'ios' ? linkCustom : copyClipBoard}
            shareKakao={linkCustom}
          />
        </View>
        {/* {Platform.OS === 'android' && (
          <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
            <Text style={{ fontSize: 12, color: '#888888' }}>
              안드로이드는{' '}
              <Text style={{ color: '#4A26F4', fontWeight: 'bold' }}>
                공유 시
              </Text>
              , 클립보드로 복사됩니다.
            </Text>
            <Text style={{ fontSize: 12, color: '#888888' }}>
              공유하고자 하는 곳에 붙여넣기하여 공유 해 주세요.
            </Text>
          </View>
        )} */}
        <View style={{marginHorizontal: 20, marginBottom: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
            {/* <ReplyCount count={curationLists.wo_count} /> */}

            {/* <TouchableOpacity
              activeOpacity={1}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={token ? addLikeBtn : favorLoginInfo}>
              <Image
                source={
                  curationLists.my_favor
                    ? require('../src/assets/img/ic_like_on.png')
                    : require('../src/assets/img/ic_like_off.png')
                }
                style={{width: 25, height: 25, marginRight: 2}}
                resizeMode="contain"
              />
              <Text style={{fontSize: 15, color: '#888888'}}>
                좋아요({curationLists.cu_favor_count})
              </Text>
            </TouchableOpacity> */}
          </View>

          {token ? (
            <ReplyForm
              wo_ref_id={cuId}
              wo_category="curation"
              navigation={navigation}
              getReplyAPI={getReplyAPI}
              getApi={getApi}
            />
          ) : (
            <Text style={{fontSize: 16, color: '#666666', marginTop: 20}}>
              댓글 작성은 회원만 이용하실 수 있습니다.
            </Text>
          )}
        </View>

        {/* 댓글 카운트 */}
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: 10,
          }}>
          <ReplyCount count={curationLists.wo_count} />
        </View>
        {/* 댓글 카운트 */}

        <Pressable
          style={{
            borderWidth: 0.5,
            borderColor: '#CCCCCC',
          }}
        />

        {/* 댓글 리스트 */}
        <Reply
          ReplyDel={ReplyDel}
          replyLists={replyLists}
          getReplyAPI={getReplyAPI}
        />
        {/* 댓글 리스트 */}
      </Content>
    </Container>
  );
};

export default CurationDetail;
