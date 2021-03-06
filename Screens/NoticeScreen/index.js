import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native'
import { Container, Content } from 'native-base'
import Header from '../Common/Header'
import qs from 'qs'
import 'moment/locale/ko'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { VegasPost } from '../../utils/axios.config'

const index = ({ navigation, route }) => {
  const title = route.params.title
  const [notice, setNotice] = useState([])
  const [pageCurrent, setPageCurrent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchingStatus, setFetchingStatus] = useState(false)
  const token = useSelector((state) => state.Reducer.token)

  const getNotice = async () => {
    console.log('getNotice')
    try {
      await VegasPost(
        '/api/notice/get_notices',
        qs.stringify({
          page: fetchingStatus ? pageCurrent + 1 : false
        }),
        { headers: { authorization: `${token}` } }
      )
        .then((res) => {
          console.log('Notice res :: ', res)
          if (res.result === 'success') {
            setNotice(notice.concat(res.data))
            setFetchingStatus(res.data.length !== 0)
            setIsLoading(false)
            setPageCurrent(pageCurrent + 1)
          } else {
            setFetchingStatus(false)
            setIsLoading(true)
            setPageCurrent(pageCurrent + 1)
          }
        })
        .catch((e) => console.error(e))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    console.log('useEffect')
    console.log('useEffect pageCurrent : ', pageCurrent)
    setIsLoading(true)
    getNotice()
  }, [])

  const renderRow = ({ item, index }) => {
    // console.log('notice : ', notice);
    return (
      <View style={{ marginVertical: 10 }} key={item.no_id}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('NoticeDetail', {
              title: '????????????',
              id: item.no_id
            })}
        >
          {item.no_is_event === '1' ? (
            <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#4A26F4',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginRight: 10,
                  marginBottom: 5
                }}
              >
                <Text style={{ fontSize: 14, lineHeight: 24, color: '#fff' }}>
                  ?????????
                </Text>
              </View>
              <Text
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 18,
                  lineHeight: 24,
                  marginBottom: 5
                }}
              >
                {item.no_title}
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 18, lineHeight: 24, marginBottom: 5 }}>
              {item.no_title}
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#666666' }}>
              {moment(item.no_updated_at).format('YYYY/MM/DD')}
            </Text>
            <Text style={{ color: '#666666' }}>{'????????? ?????? >'}</Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: '#E3E3E3',
            marginTop: 15
          }}
        />
      </View>
    )
  };

  const handleScroll = (e) => {
    const scrollY =
      e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height
    if (scrollY >= e.nativeEvent.contentSize.height - 250) {
      getNotice()
    }
  }

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
      {notice.length > 10 ? (
        <TouchableOpacity
          activeOpacity={0.8}
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
      ) : null}
      <View>
        <View style={{ paddingHorizontal: 20, marginBottom: 50 }}>
          {/* ???????????? ????????? */}
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 16, color: '#666666' }}>
              ????????? {notice.length}???
            </Text>
          </View>

          <FlatList
            ref={FlatListRef}
            data={notice}
            renderItem={renderRow}
            keyExtractor={(item, index) => index.toString()}
            onScroll={fetchingStatus ? (event) => handleScroll(event) : false}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            scrollEnabled
            nestedScrollEnabled
          />
        </View>
      </View>
    </Container>
  )
};

const styles = StyleSheet.create({
  loader: {
    marginTop: 10,
    alignItems: 'center'
  }
})

export default index
