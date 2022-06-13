import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Container, Content, Thumbnail} from 'native-base';
import {useSelector} from 'react-redux';
import {TabView, SceneMap} from 'react-native-tab-view';
import AsyncStorage from '@react-native-community/async-storage';
import 'moment/locale/ko';
import moment from 'moment';
import BottomTabs from '../Common/BottomTabs';
import SearchBar from '../Common/SearchBar';

import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import qs from 'qs';

const {window} = Dimensions.get('window');

// const baseUrl = 'https://gongjuro.com';
const baseUrl = 'https://dmonster1826.cafe24.com';

const Event = (props) => {
  const navigation = props.navigation;
  const [events, setEvents] = useState([]);
  const userId = props.userId;
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [reviewCurrentPage, setReviewCurrentPage] = useState(0);
  const [isToTop, setIsToTopBtn] = useState(false);

  const getEventAPI = async () => {
    try {
      const res = await axios({
        method: 'post',
        url: `${baseUrl}/api/talk/get_talks`,
        data: qs.stringify({
          tk_division: 'event',
          page: fetchingStatus ? reviewCurrentPage + 1 : false,
        }),
        headers: {
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
      });

      if (res.data.result === 'success') {
        setEvents(events.concat(res.data.data));
        setFetchingStatus(res.data.data.length !== 0);
        setIsLoading(false);
        setReviewCurrentPage(reviewCurrentPage + 1);
      } else {
        setFetchingStatus(false);
        setIsLoading(true);
        setReviewCurrentPage(reviewCurrentPage + 1);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  console.log('events : ', events);

  useEffect(() => {
    getEventAPI();
    foucsNav();
  }, []);

  const foucsNav = () => {
    props.navigation.addListener('focus', () => {
      getEventAPI();
    });
  };

  const e_handleScroll = (e) => {
    const scrollY =
      e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
    if (scrollY >= e.nativeEvent.contentSize.height - 250) {
      // setReviewCurrentPage(reviewCurrentPage + 1);
      getEventAPI();
      setIsToTopBtn(true);
    }
  };

  const renderFooter = () => {
    return (
      <View>
        {fetchingStatus && isLoading ? (
          <ActivityIndicator
            size="large"
            color="#4A26F4"
            style={{marginLeft: 4}}
          />
        ) : null}
      </View>
    );
  };

  const eventRenderRow = ({item}) => {
    return (
      <View style={{position: 'relative'}}>
        <View key={item.tk_id}>
          <View style={{marginHorizontal: 20, marginTop: 20}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('TalkDetail', {
                  title: '자유게시판',
                  tk_id: item.tk_id,
                  tk_division: item.tk_division,
                  tk_user_id: item.tk_user_id,
                  ut_id: item.ut_id,
                  ut_nickname: item.ut_nickname,
                  ut_image: item.ut_image,
                  tk_content: item.tk_content,
                  files: item.files,
                  wo_count: item.wo_count,
                  ar_updated_at: item.ar_updated_at,
                })
              }>
              {item.tk_user_id === userId ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderColor: '#eaeaea',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#666666',
                      letterSpacing: -1,
                    }}>
                    내가 쓴 글
                  </Text>
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                {!item.ut_image ? (
                  <Thumbnail
                    source={require('../src/assets/img/pr_no_img.png')}
                    style={styles.thumbnailStyle}
                    resizeMode="cover"
                  />
                ) : (
                  <Thumbnail
                    source={{
                      uri: `${baseUrl}/${item.ut_image}`,
                    }}
                    style={styles.thumbnailStyle}
                    resizeMode="cover"
                  />
                )}
                <View>
                  <View style={{flexDirection: 'row', marginBottom: 5}}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#4A26F4',
                        marginRight: 5,
                      }}>
                      자유게시판
                    </Text>
                    <Text style={{fontSize: 16, color: '#000'}}>
                      {item.ut_nickname}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, color: '#888'}}>
                      {moment(item.ar_updated_at).fromNow()}
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
                      {item.wo_count}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={{fontSize: 15, color: '#888', lineHeight: 20}}>
                {item.tk_content}
              </Text>
            </TouchableOpacity>
          </View>
          {item.files ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingLeft: 20,
                  paddingRight: 10,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('TalkDetail', {
                      title: '자유게시판',
                      tk_id: item.tk_id,
                      tk_division: item.tk_division,
                      tk_user_id: item.tk_user_id,
                      ut_id: item.ut_id,
                      ut_nickname: item.ut_nickname,
                      ut_image: item.ut_image,
                      tk_content: item.tk_content,
                      files: item.files,
                      wo_count: item.wo_count,
                      ar_updated_at: item.ar_updated_at,
                    })
                  }
                  style={{flexDirection: 'row'}}>
                  {item.files.map((file, idx) => (
                    <Image
                      key={idx}
                      source={{
                        uri: `${baseUrl}/${file.ft_file_path}`,
                      }}
                      resizeMode="cover"
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                        marginRight: 10,
                        marginTop: 20,
                      }}
                    />
                  ))}
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : null}
          <View
            style={{
              width: window,
              height: 1,
              backgroundColor: '#eaeaea',
              marginTop: 20,
            }}
          />
        </View>
      </View>
    );
  };

  const FlatListRef = useRef(null);

  const ScrollTopEventHandler = () => {
    FlatListRef.current?.scrollToOffset({animated: true, y: 0});
  };

  return (
    <View>
      {events.length > 3 ? (
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}
          onPress={ScrollTopEventHandler}
          style={{
            position: 'absolute',
            bottom: 10,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            borderRadius: 30,
            borderWidth: 1,
            borderColor: '#4A26F4',
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 2,
            marginBottom: 20,
            zIndex: 5,
            elevation: 0,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#222',
              marginBottom: 2,
            }}>
            Top
          </Text>
        </TouchableOpacity>
      ) : null}
      {/* events 탭(자유게시판) 1번째 리스트 */}
      <FlatList
        data={events}
        ref={FlatListRef}
        renderItem={eventRenderRow}
        keyExtractor={(list, index) => index.toString()}
        onScroll={fetchingStatus ? (event) => e_handleScroll(event) : false}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        nestedScrollEnabled
        ListEmptyComponent={
          <View
            style={{
              width: '100%',
              minHeight: 200,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>등록된 데이터가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
};

const Question = (props) => {
  const navigation = props.navigation;
  const [questions, setQuestions] = useState([]);
  const userId = props.userId;
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [reviewCurrentPage, setReviewCurrentPage] = useState(0);

  const getQuestionAPI = async () => {
    await axios({
      method: 'post',
      url: `${baseUrl}/api/talk/get_talks`,
      data: qs.stringify({
        tk_division: 'question',
        page: fetchingStatus ? reviewCurrentPage + 1 : false,
      }),
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        if (res.data.result === 'success') {
          setQuestions(questions.concat(res.data.data));
          setFetchingStatus(res.data.data.length !== 0);
          setIsLoading(false);
          setReviewCurrentPage(reviewCurrentPage + 1);
        } else {
          setFetchingStatus(false);
          setIsLoading(true);
          setReviewCurrentPage(reviewCurrentPage + 1);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getQuestionAPI();
    foucsNav02();
  }, []);

  const foucsNav02 = () => {
    props.navigation.addListener('focus', () => {
      getQuestionAPI();
    });
  };

  const q_handleScroll = (e) => {
    const scrollY =
      e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
    if (scrollY >= e.nativeEvent.contentSize.height - 250) {
      // setReviewCurrentPage(reviewCurrentPage + 1);
      getQuestionAPI();
    }
  };

  const renderFooter = () => {
    return (
      <View>
        {fetchingStatus && isLoading ? (
          <ActivityIndicator
            size="large"
            color="#4A26F4"
            style={{marginLeft: 4}}
          />
        ) : null}
      </View>
    );
  };
  const questionRenderRow = ({item}) => {
    return (
      <View key={item.tk_id}>
        <View style={{marginHorizontal: 20, marginTop: 20}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('TalkDetail', {
                title: '질문있어요',
                tk_id: item.tk_id,
                tk_division: item.tk_division,
                tk_user_id: item.tk_user_id,
                ut_id: item.ut_id,
                ut_nickname: item.ut_nickname,
                ut_image: item.ut_image,
                tk_content: item.tk_content,
                files: item.files,
                wo_count: item.wo_count,
                ar_updated_at: item.ar_updated_at,
              })
            }>
            {item.tk_user_id === userId ? (
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: '#eaeaea',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#666666',
                    letterSpacing: -1,
                  }}>
                  내가 쓴 글
                </Text>
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              {!item.ut_image ? (
                <Thumbnail
                  source={require('../src/assets/img/pr_no_img.png')}
                  style={styles.thumbnailStyle}
                  resizeMode="cover"
                />
              ) : (
                <Thumbnail
                  source={{
                    uri: `${baseUrl}/${item.ut_image}`,
                  }}
                  style={styles.thumbnailStyle}
                  resizeMode="cover"
                />
              )}
              <View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#4A26F4',
                      marginRight: 5,
                    }}>
                    질문있어요
                  </Text>
                  <Text style={{fontSize: 16, color: '#000'}}>
                    {item.ut_nickname}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 16, color: '#888'}}>
                    {moment(item.ar_updated_at).fromNow()}
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
                    {item.wo_count}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={{fontSize: 15, color: '#888', lineHeight: 20}}>
              {item.tk_content}
            </Text>
          </TouchableOpacity>
        </View>
        {item.files ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 20,
                paddingRight: 10,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('TalkDetail', {
                    title: '질문있어요',
                    tk_id: item.tk_id,
                    tk_division: item.tk_division,
                    tk_user_id: item.tk_user_id,
                    ut_id: item.ut_id,
                    ut_nickname: item.ut_nickname,
                    ut_image: item.ut_image,
                    tk_content: item.tk_content,
                    files: item.files,
                    wo_count: item.wo_count,
                    ar_updated_at: item.ar_updated_at,
                  })
                }
                style={{flexDirection: 'row'}}>
                {item.files.map((file, idx) => (
                  <Image
                    key={idx}
                    source={{
                      uri: `${baseUrl}/${file.ft_file_path}`,
                    }}
                    resizeMode="cover"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginRight: 10,
                      marginTop: 20,
                    }}
                  />
                ))}
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}
        <View
          style={{
            width: window,
            height: 1,
            backgroundColor: '#eaeaea',
            marginTop: 20,
          }}
        />
      </View>
    );
  };

  const FlatListRef = useRef(null);

  const ScrollTopEventHandler = () => {
    console.log('dd');
    FlatListRef.current?.scrollToOffset({animated: true, y: 0});
  };

  return (
    <View>
      {questions.length > 3 ? (
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}
          onPress={ScrollTopEventHandler}
          style={{
            position: 'absolute',
            bottom: 10,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            borderRadius: 30,
            borderWidth: 1,
            borderColor: '#4A26F4',
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 2,
            marginBottom: 20,
            zIndex: 5,
            elevation: 0,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#222',
              marginBottom: 2,
            }}>
            Top
          </Text>
        </TouchableOpacity>
      ) : null}
      {/* questions 탭(질문있어요) 2번째 리스트 */}
      <FlatList
        data={questions}
        ref={FlatListRef}
        renderItem={questionRenderRow}
        keyExtractor={(list, index) => index.toString()}
        onScroll={fetchingStatus ? (event) => q_handleScroll(event) : false}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        nestedScrollEnabled
        ListEmptyComponent={
          <View
            style={{
              width: '100%',
              minHeight: 200,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>등록된 데이터가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
};

const Review = (props) => {
  const navigation = props.navigation;
  const [reviews, setReviews] = useState([]);
  const userId = props.userId;
  const [reviewCurrentPage, setReviewCurrentPage] = useState(1);
  const [listData, setListData] = useState([]);
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [listDataNull, setListDataNull] = useState(false);
  const [isToTop, setIsToTopBtn] = useState(false);

  const today = new Date();
  const talkUpdatedDay = (day) => {
    return new Date(day);
  };

  const getTalkReviews = async () => {
    console.log('fetchingStatus : ', fetchingStatus);

    await axios({
      method: 'post',
      url: `${baseUrl}/api/talk/get_talks`,
      data: qs.stringify({
        tk_division: 'review',
        page: fetchingStatus ? reviewCurrentPage : false,
      }),
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        console.log('page : ', reviewCurrentPage);
        if (res.data.result === 'success') {
          setReviews(reviews.concat(res.data.data));
          setFetchingStatus(res.data.data.length !== 0);
          setIsLoading(false);
          setReviewCurrentPage(reviewCurrentPage + 1);
        } else {
          setFetchingStatus(false);
          setIsLoading(true);
          setReviewCurrentPage(reviewCurrentPage + 1);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getTalkReviews();
    foucsNav03();
  }, []);

  const foucsNav03 = () => {
    props.navigation.addListener('focus', () => {
      getTalkReviews();
    });
  };

  const r_handleScroll = (e) => {
    const scrollY =
      e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
    if (
      scrollY >= e.nativeEvent.contentSize.height - 250 &&
      fetchingStatus === true
    ) {
      // setReviewCurrentPage(reviewCurrentPage + 2);
      getTalkReviews();
      setIsToTopBtn(true);
    }
  };

  const goScrollTop = (e) => {
    console.log('goScrollTop e :: ', e);
  };

  const reviewRenderRow = ({item}) => {
    return (
      <View key={item.tk_id}>
        <View style={{marginHorizontal: 20, marginTop: 20}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('TalkDetail', {
                title: '여행후기',
                tk_id: item.tk_id,
                tk_division: item.tk_division,
                tk_user_id: item.tk_user_id,
                ut_id: item.ut_id,
                ut_nickname: item.ut_nickname,
                ut_image: item.ut_image,
                tk_content: item.tk_content,
                files: item.files,
                wo_count: item.wo_count,
                ar_updated_at: item.ar_updated_at,
              })
            }>
            {item.tk_user_id === userId ? (
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: '#eaeaea',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#666666',
                    letterSpacing: -1,
                  }}>
                  내가 쓴 글
                </Text>
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              {!item.ut_image ? (
                <Thumbnail
                  source={require('../src/assets/img/pr_no_img.png')}
                  style={styles.thumbnailStyle}
                  resizeMode="cover"
                />
              ) : (
                <Thumbnail
                  source={{
                    uri: `${baseUrl}/${item.ut_image}`,
                  }}
                  style={styles.thumbnailStyle}
                  resizeMode="cover"
                />
              )}
              <View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#4A26F4',
                      marginRight: 5,
                    }}>
                    여행후기
                  </Text>
                  <Text style={{fontSize: 16, color: '#000'}}>
                    {item.ut_nickname}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 16, color: '#888'}}>
                    {moment(item.ar_updated_at).fromNow()}
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
                    {item.wo_count}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={{fontSize: 15, color: '#888', lineHeight: 20}}>
              {item.tk_content}
            </Text>
          </TouchableOpacity>
        </View>
        {item.files ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 20,
                paddingRight: 10,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('TalkDetail', {
                    title: '여행후기',
                    tk_id: item.tk_id,
                    tk_division: item.tk_division,
                    tk_user_id: item.tk_user_id,
                    ut_id: item.ut_id,
                    ut_nickname: item.ut_nickname,
                    ut_image: item.ut_image,
                    tk_content: item.tk_content,
                    files: item.files,
                    wo_count: item.wo_count,
                    ar_updated_at: item.ar_updated_at,
                  })
                }
                style={{flexDirection: 'row'}}>
                {item.files.map((file, idx) => (
                  <Image
                    key={idx}
                    source={{
                      uri: `${baseUrl}/${file.ft_file_path}`,
                    }}
                    resizeMode="cover"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginRight: 10,
                      marginTop: 20,
                    }}
                  />
                ))}
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}
        <View
          style={{
            width: window,
            height: 1,
            backgroundColor: '#eaeaea',
            marginTop: 20,
          }}
        />
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View>
        {fetchingStatus && isLoading ? (
          <ActivityIndicator
            size="large"
            color="#4A26F4"
            style={{marginLeft: 4}}
          />
        ) : null}
      </View>
    );
  };

  const FlatListRef = useRef(null);

  const ScrollTopEventHandler = () => {
    FlatListRef.current?.scrollToOffset({animated: true, y: 0});
  };

  return (
    <View>
      {/* Review 탭(여행후기) 3번째 리스트 */}

      {reviews.length > 3 ? (
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}
          onPress={ScrollTopEventHandler}
          style={{
            position: 'absolute',
            bottom: 10,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            borderRadius: 30,
            borderWidth: 1,
            borderColor: '#4A26F4',
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 2,
            marginBottom: 20,
            zIndex: 5,
            elevation: 0,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#222',
              marginBottom: 2,
            }}>
            Top
          </Text>
        </TouchableOpacity>
      ) : null}
      <FlatList
        data={reviews}
        ref={FlatListRef}
        renderItem={reviewRenderRow}
        keyExtractor={(list, index) => index.toString()}
        onScroll={(event) => r_handleScroll(event)}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        nestedScrollEnabled
        ListEmptyComponent={
          <View
            style={{
              width: '100%',
              minHeight: 200,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>등록된 데이터가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
};

const initialLayout = {width: Dimensions.get('window').width};

const TalkScreen = ({navigation, route}) => {
  const [userToken, setUserToken] = useState(null);

  const userId = useSelector((state) => state.UserInfoReducer.ut_id);

  const getToken = async () => {
    await AsyncStorage.getItem('@vegasTongToken', (err, result) => {
      try {
        if (result !== null) {
          setUserToken(result);
        }
        if (result === null) {
          console.log('토큰값이 없습니다. :', result);
        }
      } catch {
        console.log('문제가 있습니다. : ', err);
      }
    });
  };

  useEffect(() => {
    getToken();
  }, []);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: '자유게시판', navigation: navigation},
    {key: 'second', title: '질문있어요', navigation: navigation},
    {key: 'third', title: '여행후기', navigation: navigation},
  ]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <Event navigation={navigation} userId={userId} />;
      case 'second':
        return <Question navigation={navigation} userId={userId} />;
      case 'third':
        return <Review navigation={navigation} userId={userId} />;
    }
  };

  const TabBar = (props) => {
    const {tabIndex, jumpTo} = props;

    return (
      <View
        style={{
          paddingHorizontal: 20,
          borderRadius: 35,
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 35,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#E3E3E3',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              borderRadius: 35,
              backgroundColor:
                tabIndex === 'first' && index === 0 ? '#4A26F4' : '#fff',
              width: '33%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async () => {
              await jumpTo('first');
              await setTabIndex('first');
            }}>
            <Text
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                fontSize: 12,
                color: tabIndex === 'first' && index === 0 ? '#fff' : '#000',
              }}>
              자유게시판
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              borderRadius: 35,
              backgroundColor:
                tabIndex === 'second' || index === 1 ? '#4A26F4' : '#fff',
              width: '33%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async () => {
              await jumpTo('second');
              await setTabIndex('second');
            }}>
            <Text
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                fontSize: 12,
                color: tabIndex === 'second' || index === 1 ? '#fff' : '#000',
              }}>
              질문있어요
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              borderRadius: 35,
              backgroundColor:
                tabIndex === 'third' || index === 2 ? '#4A26F4' : '#fff',
              width: '33%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async () => {
              await jumpTo('third');
              await setTabIndex('third');
            }}>
            <Text
              style={{
                paddingVertical: 12,
                fontSize: 12,
                color: tabIndex === 'third' || index === 2 ? '#fff' : '#000',
              }}>
              여행후기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const routeName = route.name;

  const [tabIndex, setTabIndex] = useState('first');

  return (
    <>
      <Container>
        <SearchBar navigation={navigation} />

        <TabView
          renderTabBar={(props) => (
            <TabBar
              {...props}
              navigation={navigation}
              setTabIndex={setTabIndex}
              tabIndex={tabIndex}
              onIndexChange={setIndex}
            />
          )}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          swipeEnabled={false}
        />

        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              !userToken
                ? Alert.alert(
                    '회원만 글쓰기가 가능합니다.',
                    '로그인이 필요합니다.',
                    [
                      {
                        text: '로그인하기',
                        onPress: () => navigation.navigate('login'),
                      },
                      {text: '취소'},
                    ],
                  )
                : navigation.navigate('TalkFaq', {
                    title: '베가스톡톡',
                  });
            }}
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              elevation: 5,
              zIndex: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 60,
              backgroundColor: '#4A26F4',
              borderRadius: 30,
            }}>
            {/* <Image
              source={require('../src/assets/img/write_btn.png')}
              resizeMode='contain'
              style={{
                width: 70,
                height: 70
              }}
            /> */}
            <Image
              source={require('../src/assets/img/ic_write.png')}
              resizeMode="contain"
              style={{width: 30, height: 55}}
            />
          </TouchableOpacity>
        </View>
      </Container>
      <BottomTabs navigation={navigation} routeName={routeName} />
    </>
  );
};

const styles = StyleSheet.create({
  thumbnailStyle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default TalkScreen;
