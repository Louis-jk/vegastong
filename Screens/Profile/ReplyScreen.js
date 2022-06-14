import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import Config from 'react-native-config'
import { Container, Content } from 'native-base'
import { useSelector } from 'react-redux'
import qs from 'qs'
import { useLinkTo } from '@react-navigation/native'
import 'moment/locale/ko'
import moment from 'moment'
import Header from '../Common/Header'
import { VegasPost } from '../../utils/axios.config'

const BASE_URL = Config.BASE_URL

const ReplyScreen = ({ navigation, route }) => {
  const title = route.params.title

  const linkTo = useLinkTo()

  const token = useSelector((state) => state.Reducer.token)
  const [myWord, setMyWord] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchingStatus, setFetchingStatus] = useState(false)
  const [pageCurrent, setPageCurrent] = useState(0)

  const getMyReply = async () => {
    try {
      const res = await VegasPost(
        '/api/user/get_my_words',
        qs.stringify({
          page: fetchingStatus ? pageCurrent + 1 : false
        }),
        { headers: { authorization: `${token}` } }
      )

      if (res.result === 'success') {
        console.log('내가 쓴 댓글 res ?', res)
        setMyWord(myWord.concat(res.data))
        setFetchingStatus(res.data.length !== 0)
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

  console.log('내가 쓴 댓글 : ', myWord)

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
    console.log('내가 쓴 댓글 Render item', item)

    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          key={idx}
          onPress={() =>
            item.wo_category === 'curation'
              ? navigation.navigate('CurationDetail', {
                  title: '내가 쓴 댓글',
                  id: item.wo_ref_id
                })
              : item.wo_category === 'talk'
                ? navigation.navigate('TalkDetail', {
                    title: '내가 쓴 댓글',
                    tk_id: item.wo_ref_id
                  })
                : item.wo_category === 'trip'
                  ? navigation.navigate('TripDetail', {
                      title: '내가 쓴 댓글',
                      id: item.wo_ref_id
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
                      item.wo_category === 'curation'
                        ? '#4A26F4'
                        : item.wo_category === 'talk'
                          ? '#4A26F4'
                          : item.wo_category === 'trip'
                            ? '#4A26F4'
                            : 'transparent',
                    paddingVertical: 2,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    color: '#fff',
                    marginRight: 10
                  }}
                >
                  {item.wo_category === 'curation'
                    ? '새소식'
                    : item.wo_category == 'talk'
                      ? '베가스톡톡'
                      : item.wo_category == 'trip'
                        ? '베가스여행'
                        : null}
                </Text>
                <Text style={{ fontSize: 14, color: '#888888' }}>
                  {moment(item.wo_created_at).format('YYYY.MM.DD')}
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
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 24,
                  marginBottom: 5,
                  color: '#222222'
                }}
              >
                {item.curation
                  ? item.curation.cu_title
                  : item.talk
                    ? item.talk.tk_content
                    : item.trip
                      ? item.trip.tr_name
                      : null}
              </Text>
              <Text style={{ fontSize: 16, color: '#666666', marginTop: 10 }}>
                {item.wo_word}
              </Text>
            </View>
            {item.files.length > 0 ? (
              <ImageBackground
                source={{
                  uri: `${BASE_URL}${item.files[0].ft_file_path}`
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
    <Container style={{ backgroundColor: '#fff' }}>
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

      {myWord && myWord.length > 0 ? (
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
          ListEmptyComponent={
            <View
              style={{
                width: '100%',
                minHeight: Dimensions.get('window').height - 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff'
              }}
            >
              <Text>아직 작성한 댓글이 없습니다.</Text>
            </View>
          }
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text>작성한 댓글이 없습니다.</Text>
        </View>
      )}
    </Container>
  )
};

export default ReplyScreen
