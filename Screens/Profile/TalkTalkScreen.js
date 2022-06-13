import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
  ActivityIndicator
} from 'react-native'
import { Container, Content } from 'native-base'
import { useSelector } from 'react-redux'
import qs from 'qs'
import axios from 'axios'
import { useLinkTo } from '@react-navigation/native'
import 'moment/locale/ko'
import moment from 'moment'
import Header from '../Common/Header'

const baseUrl = 'https://dmonster1826.cafe24.com'

const TalkTalkScreen = ({ navigation, route }) => {
  const title = route.params.title

  const linkTo = useLinkTo()

  const token = useSelector((state) => state.Reducer.token)
  const { ut_id, ut_nickname, ut_image } = useSelector(
    (state) => state.UserInfoReducer
  )

  const [myWord, setMyWord] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchingStatus, setFetchingStatus] = useState(false)
  const [pageCurrent, setPageCurrent] = useState(0)

  const getMyReply = async () => {
    try {
      const res = await axios({
        method: 'post',
        url: `${baseUrl}/api/talk/get_my_talks`,
        headers: {
          authorization: token,
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U'
        },
        data: qs.stringify({
          page: fetchingStatus ? pageCurrent + 1 : false
        })
      })

      if (res.data.result === 'success') {
        setMyWord(myWord.concat(res.data.data))
        setFetchingStatus(res.data.data.length !== 0)
        setIsLoading(false)
        setPageCurrent(pageCurrent + 1)
      } else {
        setFetchingStatus(false)
        setIsLoading(true)
        setPageCurrent(pageCurrent + 1)
      }
    } catch (err) {
      console.log('err', err)
    }
  }

  console.log('내가 쓴 톡톡 : ', myWord)

  useEffect(() => {
    getMyReply()
  }, [])

  // ToTop 스크롤
  const scrollRef = useRef()
  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true
    })
  };

  const handleScroll = (e) => {
    const scrollY =
      e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height
    if (scrollY >= e.nativeEvent.contentSize.height - 250) {
      getMyReply()
    }
  }

  const RenderRow = ({ item, idx }) => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          key={idx}
          onPress={() =>
            item.tk_division === 'event'
              ? navigation.navigate('TalkDetail', {
                  title: '내가 쓴 톡톡',
                  tk_id: item.tk_id,
                  tk_division: item.tk_division,
                  tk_user_id: item.tk_user_id,
                  ut_id: ut_id,
                  ut_nickname: ut_nickname,
                  ut_image: ut_image,
                  tk_content: item.tk_content,
                  files: item.files,
                  wo_count: item.wo_count,
                  ar_updated_at: item.ar_updated_at
                })
              : item.tk_division === 'question'
                ? navigation.navigate('TalkDetail', {
                    title: '내가 쓴 톡톡',
                    tk_id: item.tk_id,
                    tk_division: item.tk_division,
                    tk_user_id: item.tk_user_id,
                    ut_id: ut_id,
                    ut_nickname: ut_nickname,
                    ut_image: ut_image,
                    tk_content: item.tk_content,
                    files: item.files,
                    wo_count: item.wo_count,
                    ar_updated_at: item.ar_updated_at
                  })
                : item.tk_division === 'review'
                  ? navigation.navigate('TalkDetail', {
                      title: '내가 쓴 톡톡',
                      tk_id: item.tk_id,
                      tk_division: item.tk_division,
                      tk_user_id: item.tk_user_id,
                      ut_id: ut_id,
                      ut_nickname: ut_nickname,
                      ut_image: ut_image,
                      tk_content: item.tk_content,
                      files: item.files,
                      wo_count: item.wo_count,
                      ar_updated_at: item.ar_updated_at
                    })
                  : null}
        >
          <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    backgroundColor:
                      item.tk_division == 'question'
                        ? '#4A26F4'
                        : item.tk_division == 'event'
                          ? '#4A26F4'
                          : item.tk_division == 'review'
                            ? '#4A26F4'
                            : 'transparent',
                    paddingVertical: 2,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    color: '#fff',
                    marginRight: 10
                  }}
                >
                  {item.tk_division == 'event'
                    ? '자유게시판'
                    : item.tk_division == 'question'
                      ? '질문있어요'
                      : item.tk_division == 'review'
                        ? '여행후기'
                        : null}
                </Text>
                <Text style={{ fontSize: 16, color: '#888888' }}>
                  {moment(item.ar_created_at).format('YYYY/MM/DD')}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#888888'
                  }}
                >
                  {'더보기 >'}
                </Text>
              </View>
            </View>
            <View style={{ marginBottom: item.files.length > 0 ? 10 : 0 }}>
              <Text style={{ fontSize: 16, color: '#666666' }}>
                {item.tk_content}
              </Text>
            </View>
            {item.files.length > 0 ? (
              <ImageBackground
                source={{
                  uri: `${baseUrl}${item.files[0].ft_file_path}`
                }}
                resizeMode='cover'
                style={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  marginRight: 15
                }}
                imageStyle={{ borderRadius: 10 }}
              >
                {item.files.length > 1 ? (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderTopLeftRadius: 10
                    }}
                  >
                    <Text>{item.files.length}</Text>
                  </View>
                ) : null}
              </ImageBackground>
            ) : null}
          </View>
        </TouchableOpacity>
        <View style={{ height: 1, width: '100%', backgroundColor: '#EEEEEE' }} />
      </>
    )
  };

  const renderFooter = () => {
    return (
      <View>
        {fetchingStatus && isLoading ? (
          <ActivityIndicator
            size='large'
            color='#4A26F4'
            style={{ marginLeft: 4 }}
          />
        ) : null}
      </View>
    )
  };

  const FlatListRef = useRef(null)

  const ScrollTopEventHandler = () => {
    FlatListRef.current?.scrollToOffset({ animated: true, y: 0 })
  };

  return (
    <Container>
      <Header navigation={navigation} title={title} />
      {myWord.length > 10 && (
        <TouchableOpacity
          onPress={ScrollTopEventHandler}
          style={{
            position: 'absolute',
            bottom: 10,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            borderRadius: 30,
            borderWidth: 1,
            borderColor: '#E3E3E3',
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 5,
            marginBottom: 20,
            zIndex: 5,
            elevation: 0
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#222222' }}>
            Top
          </Text>
        </TouchableOpacity>
      )}

      {myWord ? (
        <FlatList
          ref={FlatListRef}
          data={myWord}
          renderItem={RenderRow}
          keyExtractor={(list, index) => index.toString()}
          onScroll={(event) => handleScroll(event)}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          nestedScrollEnabled
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text>작성한 글이 없습니다.</Text>
        </View>
      )}
    </Container>
  )
};

export default TalkTalkScreen
