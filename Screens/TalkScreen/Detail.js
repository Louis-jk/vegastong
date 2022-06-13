import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Pressable,
} from 'react-native';
import {Container, Content, Thumbnail, Form, Textarea} from 'native-base';
import Swiper from 'react-native-swiper';
import {useSelector} from 'react-redux';
import qs from 'qs';
import axios from 'axios';
import 'moment/locale/ko';
import moment from 'moment';
import BottomTabs from '../Common/BottomTabs';
import Header from '../Common/Header';
import Reply from '../Reply';
import ReplyForm from '../Common/ReplyForm';
import ReplyCount from '../Common/ReplyCount';
import {TouchableOpacity} from 'react-native-gesture-handler';

// const baseUrl = 'https://gongjuro.com';
const baseUrl = 'https://dmonster1826.cafe24.com';

const Detail = (props) => {
  const navigation = props.navigation;

  const getAPI = props.route.params.getAPI;

  const token = useSelector((state) => state.Reducer.token);
  const userId = useSelector((state) => state.UserInfoReducer.ut_id);
  console.log('Talk Screen Detail : ', props);

  const {tk_id, tk_user_id, title, ut_image, ar_updated_at} =
    props.route.params;

  console.log('Talk Detail props : ', props);

  console.log('[DETAIL] : ', props.route.params);

  const {width, height} = Dimensions.get('window');

  const [contentWordCount, setContentWordCount] = useState(0);
  const [nickName, setNickName] = useState(null);
  const [division, setDivision] = useState(null);
  const [contentArId, setContentArId] = useState(0);
  const [tagTravel, setTagTravel] = useState(0);
  const [tagRestaurant, setTagRestaurant] = useState(0);
  const [tagCafe, setTagCafe] = useState(0);
  const [tagShop, setTagShop] = useState(0);
  const [replyLists, setReplyLists] = useState([]);
  const [tkContent, setTkContent] = useState();
  const [files, setFiles] = useState([]);

  // const tk_division =
  //   division === 'event'
  //     ? '이벤트참여'
  //     : division === 'question'
  //     ? '질문있어요'
  //     : division === 'review'
  //     ? '여행후기'
  //     : null;

  // 베가스톡톡 해당페이지 호출
  const getApi = () => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/talk/get_talk/${tk_id}`,
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        console.log('sDetail : ', res);
        if (res.data.result == 'success') {
          setContentWordCount(res.data.data.wo_count);
          setNickName(res.data.data.ut_nickname);
          setDivision(res.data.data.tk_division);
          setContentArId(res.data.data.ar_id);
          setTagTravel(res.data.data.ar_tag_travel);
          setTagRestaurant(res.data.data.ar_tag_restaurant);
          setTagCafe(res.data.data.ar_tag_cafe);
          setTagShop(res.data.data.ar_tag_shop);
          setTkContent(res.data.data.tk_content);

          setFiles(res.data.data.files);
        }
      })
      .catch((err) => console.log(err));
  };

  console.log('Division ? ', division);
  console.log('T Detail TKID ? ', tk_id);

  // 베가스톡톡 해당페이지 댓글 호출
  const getReplyAPI = () => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/word/get_words`,
      data: qs.stringify({
        tk_division: division,
      }),
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
      params: {
        wo_category: 'talk',
        wo_ref_id: tk_id,
        page: 1,
      },
    })
      .then((res) => {
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

  // 내가 쓴 Talk 삭제

  const delAPI = async () => {
    await axios({
      methos: 'get',
      url: `${baseUrl}/api/talk/remove_talk/${tk_id}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        authorization: token,
      },
    })
      .then((res) => {
        if (res.data.result == 'success' && res.data.data == 'success') {
          Alert.alert(
            '작성하신 게시물이 삭제되었습니다.',
            '홈으로 이동하시겠습니까?',
            [
              {
                text: '홈으로 이동',
                onPress: () => navigation.navigate('home'),
              },
              {
                text: '리스트로 이동',
                onPress: () => navigation.navigate('talk'),
              },
            ],
          );
        } else {
          Alert.alert('오류가 발생했습니다.', '홈으로 이동하시겠습니까?', [
            {
              text: '홈으로 이동',
              onPress: () => navigation.navigate('home'),
            },
            {
              text: '리스트로 이동',
              onPress: () => navigation.navigate('talk'),
            },
          ]);
        }
      })
      .catch((err) => console.log(err));
  };

  const delTalk = () => {
    Alert.alert(
      '작성하신 게시물을 정말 삭제하시겠습니까?',
      '삭제한 게시물은 복구되지 않습니다.',
      [
        {
          text: '확인',
          onPress: () => delAPI(),
        },
        {
          text: '취소',
          onPress: () => {},
        },
      ],
    );
  };

  const onSubmit = () => {
    axios({
      method: 'post',
      url: `${baseUrl}/api/word/add_word`,
      headers: {
        authorization: token,
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
      data: qs.stringify({
        wo_category: 'talk',
        wo_ref_id: tk_id,
        wo_word: replyText,
        images: [],
      }),
    })
      .then((res) => {
        getReplyAPI();
        console.log(res);
      })
      .catch((err) => console.log(err));
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

  return (
    <Container>
      <Header navigation={navigation} title={title} />

      <ScrollView>
        <Content>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: 20,
              marginTop: 20,
              paddingHorizontal: 20,
            }}>
            {!ut_image ? (
              <Thumbnail
                source={require('../src/assets/img/pr_no_img.png')}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 50,
                  marginRight: 20,
                }}
                resizeMode="cover"
              />
            ) : (
              <Thumbnail
                source={{
                  uri: `${baseUrl}/${ut_image}`,
                }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 50,
                  marginRight: 20,
                }}
                resizeMode="cover"
              />
            )}

            <View>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                {division == 'review' ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#4A26F4',
                      marginRight: 5,
                    }}>
                    여행후기
                  </Text>
                ) : division == 'event' ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#4A26F4',
                      marginRight: 5,
                    }}>
                    자유게시판
                  </Text>
                ) : division == 'question' ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#4A26F4',
                      marginRight: 5,
                    }}>
                    질문있어요
                  </Text>
                ) : null}

                <Text style={{fontSize: 16, color: '#000'}}>{nickName}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, color: '#888'}}>
                  {moment(ar_updated_at).fromNow()}
                </Text>
                <View
                  style={{
                    width: 1,
                    height: 20,
                    backgroundColor: '#E3E3E3',
                    marginHorizontal: 7,
                  }}
                />
                <Image
                  source={require('../src/assets/img/ic_comment.png')}
                  style={{
                    width: 17,
                    height: 17,
                    marginTop: 2,
                    marginRight: 5,
                  }}
                  resizeMode="contain"
                />
                <Text style={{fontSize: 16, color: '#888'}}>
                  {contentWordCount}
                </Text>
              </View>
            </View>
            {tk_user_id === userId ? (
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 20,
                  alignSelf: 'flex-end',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('TalkEdit', {
                        title: '상세페이지',
                        tk_id: tk_id,
                        tk_division: division,
                        content: tkContent,
                        tagTravel: tagTravel,
                        tagRestaurant: tagRestaurant,
                        tagCafe: tagCafe,
                        tagShop: tagShop,
                      })
                    }
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      marginRight: 5,
                    }}>
                    <Text style={{color: '#AAAAAA'}}>수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={delTalk}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      backgroundColor: '#fff',
                      borderRadius: 10,
                    }}>
                    <Text style={{color: '#AAAAAA'}}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
          {files.length > 1 ? (
            <Swiper
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
                height: height / 2,
              }}
              dotColor="#rgba(255,255,255,0.7)"
              activeDotColor="#4A26F4"
              paginationStyle={{bottom: 10}}>
              {files.map((file) => (
                <Image
                  key={file.ft_id}
                  source={{uri: `${baseUrl}/${file.ft_file_path}`}}
                  resizeMode="cover"
                  style={{
                    width: width - 40,
                    height: height / 2,
                    borderRadius: 20,
                  }}
                />
              ))}
            </Swiper>
          ) : files.length == 1 ? (
            <View style={{marginHorizontal: 20}}>
              <Image
                source={{
                  uri: `${baseUrl}/${files[0].ft_file_path}`,
                }}
                resizeMode="cover"
                style={{
                  width: width - 40,
                  height: height / 2,
                  borderRadius: 20,
                }}
              />
            </View>
          ) : null}
          <View style={{paddingHorizontal: 20, marginVertical: 25}}>
            <Text style={{fontSize: 16, lineHeight: 22, color: '#333'}}>
              {tkContent}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#EAEAEA',
              marginBottom: 25,
            }}
          />
          <View style={{marginHorizontal: 20, marginBottom: 10}}>
            {token ? (
              <ReplyForm
                wo_ref_id={tk_id}
                wo_category="talk"
                navigation={navigation}
                getApi={getApi}
                getReplyAPI={getReplyAPI}
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: '#666666',
                  marginTop: 20,
                }}>
                댓글 작성은 회원만 이용하실 수 있습니다.
              </Text>
            )}
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginBottom: 10,
            }}>
            <ReplyCount count={contentWordCount} />
          </View>
          <Pressable
            style={{
              borderWidth: 0.5,
              borderColor: '#CCCCCC',
            }}
          />

          <Reply
            replyLists={replyLists}
            getApi={getApi}
            getReplyAPI={getReplyAPI}
            ReplyDel={ReplyDel}
          />
        </Content>
      </ScrollView>
    </Container>
  );
};

export default Detail;
