import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList
} from 'react-native'
import {
  Container,
  Content,
  Button,
  Icon,
  Input,
  InputGroup,
  Header,
  Thumbnail
} from 'native-base'
import { useDispatch, useSelector } from 'react-redux'
import Swiper from 'react-native-swiper'
import 'moment/locale/ko'
import moment from 'moment'

// import Swiper from 'react-native-swiper';
import BottomTabs from './BottomTabs'
import SearchBar from './SearchBar'
import Travel from '../CurationScreen/Tags/Travel'
import Restaurant from '../CurationScreen/Tags/Restaurant'
import Cafe from '../CurationScreen/Tags/Cafe'
import Shopping from '../CurationScreen/Tags/Shopping'

import qs from 'qs'
import axios from 'axios'

const { width, height } = Dimensions.get('window')

// const baseUrl = 'https://gongjuro.com'
const baseUrl = 'https://dmonster1826.cafe24.com'

const { window } = Dimensions.get('window')

const SearchList = (props) => {
  const navigation = props.navigation
  console.log('Search List : ', props)
  const routeName = props.route.params.text

  console.log('SearchList Props :: ', props)

  const [searchLists, setSearchLists] = useState([])
  const keyword = useSelector((state) => state.Reducer.keyword)
  const tag = useSelector((state) => state.Reducer.tag)
  const userId = useSelector((state) => state.UserInfoReducer.ut_id)

  useEffect(() => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/common/search_main`,
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U'
      },
      params: {
        tag: tag,
        keyword: keyword
      }
    })
      .then((res) => setSearchLists(res.data.data))
      .catch((err) => console.log(err))
  }, [tag, keyword])

  // ToTop 스크롤
  const scrollRef = useRef()
  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true
    })
  };

  console.log('searchLists :::::::', searchLists)

  const renderItem = ({ item }) => {
    console.log('renderItem list :;', item)

    return item.talk ? (
      <TouchableOpacity
        key={item.ar_id}
        onPress={() =>
          navigation.navigate('TalkDetail', {
            title: '검색리스트',
            tk_id: item.talk.tk_id,
            tk_division: item.talk.tk_division,
            tk_user_id: item.talk.tk_user_id,
            ut_id: item.talk.user.ut_id,
            ut_nickname: item.talk.user.ut_nickname,
            ut_image: item.talk.user.ut_image,
            tk_content: item.talk.tk_content,
            files: item.talk.files,
            // wo_count: item.talk.wo_count, API에서 넘어오지 않음
            ar_updated_at: item.ar_updated_at
          })}
        activeOpacity={1}
      >
        <View style={styles.contentBlock} style={{ marginVertical: 10 }}>
          <View>
            {item.talk.files.length > 1 ? (
              <Swiper
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: Dimensions.get('window').width / 2.65
                }}
                dotColor='#rgba(255,255,255,0.7)'
                activeDotColor='#4A26F4'
                paginationStyle={{ bottom: 10 }}
              >
                {item.talk.files.map((file) => (
                  <TouchableOpacity
                    key={file.ft_id}
                    activeOpacity={1}
                    onPress={() =>
                      navigation.navigate('TalkDetail', {
                        title: '검색리스트',
                        tk_id: item.talk.tk_id,
                        tk_division: item.talk.tk_division,
                        tk_user_id: item.talk.tk_user_id,
                        ut_id: item.talk.user.ut_id,
                        ut_nickname: item.talk.user.ut_nickname,
                        ut_image: item.talk.user.ut_image,
                        tk_content: item.talk.tk_content,
                        files: item.talk.files,
                        ar_updated_at: item.ar_updated_at
                      })}
                    style={{
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                      overflow: 'hidden'
                    }}
                  >
                    <Image
                      source={{
                        uri: `${baseUrl}/${file.ft_file_path}`
                      }}
                      resizeMode='cover'
                      style={{
                        width: Dimensions.get('window').width - 40,
                        height: Dimensions.get('window').width / 2.65
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </Swiper>
            ) : item.talk.files.length == 1 ? (
              <View>
                <Image
                  source={{
                    uri: `${baseUrl}/${item.talk.files[0].ft_file_path}`
                  }}
                  resizeMode='cover'
                  style={{
                    width: '100%',
                    height: width / 2.65,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10
                  }}
                />
              </View>
            ) : null}
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: '#eee',
              borderTopRightRadius: item.talk.files.length > 0 ? 0 : 10,
              borderTopLeftRadius: item.talk.files.length > 0 ? 0 : 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              padding: 15
            }}
          >
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
                {item.ar_tag_travel == '1' ? (
                  <View style={styles.tags}>
                    <Text style={styles.tagsText}>여행</Text>
                  </View>
                ) : null}
                {item.ar_tag_restaurant == '1' ? (
                  <View style={styles.tags}>
                    <Text style={styles.tagsText}>맛집</Text>
                  </View>
                ) : null}
                {item.ar_tag_cafe == '1' ? (
                  <View style={styles.tags}>
                    <Text style={styles.tagsText}>카페</Text>
                  </View>
                ) : null}
                {item.ar_tag_shop == '1' ? (
                  <View style={styles.tags}>
                    <Text style={styles.tagsText}>쇼핑</Text>
                  </View>
                ) : null}
              </View>

              {/* 유저 닉네임 */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#000'
                }}
              >
                by {item.talk.user.ut_nickname}
              </Text>
              {/* // 유저 닉네임 */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#222'
                }}
                numberOfLines={1}
              >
                {item.talk.tk_content}
              </Text>
              {item.talk.tk_user_id === userId ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderColor: '#eaeaea',
                    backgroundColor: '#fff',
                    borderRadius: 10
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#666666',
                      letterSpacing: -1
                    }}
                  >
                    내가 쓴 글
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ) : item.curation ? (
      <View key={item.ar_id} style={{ marginVertical: 10 }}>
        {item.curation.files.length > 1 ? (
          <Swiper
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').width / 2.65
            }}
            automaticallyAdjustContentInsets
            dotColor='#rgba(255,255,255,0.7)'
            activeDotColor='#4A26F4'
            paginationStyle={{ bottom: 10 }}
          >
            {item.curation.files.map((file) => (
              <TouchableOpacity
                key={file.ft_id}
                onPress={() =>
                  navigation.navigate('CurationDetail', {
                    title: item.curation.cu_title,
                    id: item.curation.cu_id
                  })}
                activeOpacity={1}
                style={{
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  overflow: 'hidden'
                }}
              >
                <Image
                  source={{
                    uri: `${baseUrl}/${file.ft_file_path}`
                  }}
                  resizeMode='cover'
                  style={{
                    width: Dimensions.get('window').width - 40,
                    height: Dimensions.get('window').width / 2.65
                  }}
                />
              </TouchableOpacity>
            ))}
          </Swiper>
        ) : item.curation.files.length == 1 ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CurationDetail', {
                title: item.curation.cu_title,
                id: item.curation.cu_id
              })}
            activeOpacity={1}
          >
            <Image
              source={{
                uri: `${baseUrl}/${item.curation.files[0].ft_file_path}`
              }}
              resizeMode='cover'
              style={{
                width: '100%',
                height: width / 2.65,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10
              }}
            />
          </TouchableOpacity>
        ) : null}
        {/* 새소식 - 관리자(베가스통) 프로필 띄우기 */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CurationDetail', {
              title: item.curation.cu_title,
              id: item.curation.cu_id
            })}
          activeOpacity={1}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: '#eee',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              padding: 15
            }}
          >
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
                {item.ar_tag_travel == '1' ? (
                  <View style={styles.tags}>
                    <Text style={styles.tagsText}>여행</Text>
                  </View>
                ) : null}
                {item.ar_tag_restaurant == '1' ? (
                  <View style={styles.tags}>
                    <Text style={styles.tagsText}>맛집</Text>
                  </View>
                ) : null}
                {item.ar_tag_cafe == '1' ? (
                  <View style={styles.tags}>
                    <Text style={styles.tagsText}>카페</Text>
                  </View>
                ) : null}
                {item.ar_tag_shop == '1' ? (
                  <View style={styles.tags}>
                    <Text style={styles.tagsText}>쇼핑</Text>
                  </View>
                ) : null}
              </View>
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#4A26F4',
                      marginRight: 5
                    }}
                  >
                    새소식
                  </Text>
                  <Text style={{ fontSize: 14, color: '#000' }}>베가스통</Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                flex: 1,
                flexWrap: 'wrap',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#222'
              }}
              numberOfLines={1}
            >
              {item.curation.cu_title}
            </Text>
          </View>
        </TouchableOpacity>
        {/* // 새소식 - 관리자(베가스통) 프로필 띄우기 */}
      </View>
    ) : item.trip ? (
      <View key={item.ar_id} style={{ marginVertical: 10 }}>
        {item.trip.files.length > 1 ? (
          <Swiper
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').width / 2.65
            }}
            dotColor='#rgba(255,255,255,0.7)'
            activeDotColor='#4A26F4'
            paginationStyle={{ bottom: 10 }}
          >
            {item.trip.files.map((file) => (
              <TouchableOpacity
                key={file.ft_id}
                onPress={() =>
                  navigation.navigate('TripDetail', {
                    id: item.trip.tr_id
                  })}
                activeOpacity={1}
                style={{
                  marginBottom: 20,
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  overflow: 'hidden'
                }}
              >
                <Image
                  source={{
                    uri: `${baseUrl}/${file.ft_file_path}`
                  }}
                  resizeMode='cover'
                  style={{
                    width: Dimensions.get('window').width - 40,
                    height: Dimensions.get('window').width / 2.65
                  }}
                />
              </TouchableOpacity>
            ))}
          </Swiper>
        ) : item.trip.files.length == 1 ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TripDetail', {
                id: item.trip.tr_id
              })}
            activeOpacity={1}
          >
            <Image
              source={{
                uri: `${baseUrl}/${item.trip.files[0].ft_file_path}`
              }}
              resizeMode='cover'
              style={{
                width: '100%',
                height: width / 2.65,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10
              }}
            />
          </TouchableOpacity>
        ) : null}
        {/* 새소식 - 관리자(베가스통) 프로필 띄우기 */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('TripDetail', {
              id: item.trip.tr_id
            })}
          activeOpacity={1}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: '#eee',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              padding: 15
            }}
          >
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#4A26F4',
                  marginRight: 5
                }}
              >
                베가스여행
              </Text>
              <Text style={{ fontSize: 14, color: '#000' }}>베가스통</Text>
            </View>
            <Text
              style={{
                flex: 1,
                flexWrap: 'wrap',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#222'
              }}
              numberOfLines={1}
            >
              {item.trip.tr_name}
            </Text>
          </View>
        </TouchableOpacity>
        {/* // 새소식 - 관리자(베가스통) 프로필 띄우기 */}
      </View>
    ) : null
  };

  return (
    <>
      <Container>
        <SearchBar navigation={navigation} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 10,
            paddingHorizontal: 20
          }}
        >
          <Travel navigation={navigation} isActive={tag === 'travel'} />
          <Restaurant navigation={navigation} isActive={tag === 'restaurant'} />
          <Cafe navigation={navigation} isActive={tag === 'cafe'} />
          <Shopping navigation={navigation} isActive={tag === 'shop'} />
        </View>
        {keyword || tag ? (
          <View style={{ marginVertical: 12, paddingHorizontal: 20 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold'
              }}
            >
              {keyword ? `#${keyword}` : null}{' '}
              {tag
                ? `#${
                    tag == 'travel'
                      ? '여행 🇺🇸'
                      : tag == 'restaurant'
                      ? '맛집🍿'
                      : tag == 'cafe'
                      ? '카페🍹'
                      : tag == 'shop'
                      ? '쇼핑💍'
                      : null
                  }`
                : null}
            </Text>
          </View>
        ) : (
          <View style={{ marginBottom: 10 }} />
        )}
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <FlatList
            data={searchLists}
            renderItem={renderItem}
            initialNumToRender={3}
            keyExtractor={(list, index) => index.toString()}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 200
                }}
              >
                <Text style={{ fontSize: 14 }}>검색 결과가 없습니다.</Text>
              </View>
            }
          />
        </View>
      </Container>

      <TouchableOpacity
        activeOpacity={1}
        hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
        onPress={onPressTouch}
        style={{
          position: 'absolute',
          bottom: 60,
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
          borderRadius: 30,
          borderWidth: 1,
          borderColor: '#4A26F4',
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingVertical: 2,
          marginBottom: 20
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#222222',
            marginBottom: 2
          }}
        >
          Top
        </Text>
      </TouchableOpacity>
      <BottomTabs navigation={navigation} routeName={routeName} />
    </>
  )
};

const styles = StyleSheet.create({
  contentListImg: {
    width: window,
    height: 180,
    borderRadius: 15,
    marginBottom: 20
  },
  tags: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F2FF',
    borderRadius: 20,
    borderColor: '#E8EBFF',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 5
  },
  tagsText: {
    fontSize: 12,
    color: '#4A26F4'
  },
  contentBlock: {}
})

export default SearchList
