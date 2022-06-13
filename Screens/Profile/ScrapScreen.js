import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Container, Content} from 'native-base';
import {useSelector} from 'react-redux';
import qs from 'qs';
import axios from 'axios';
import 'moment/locale/ko';
import moment from 'moment';
import Header from '../Common/Header';

const baseUrl = 'https://dmonster1826.cafe24.com';

const ScrapScreen = ({navigation, route}) => {
  const token = useSelector((state) => state.Reducer.token);
  const [myScraps, setMyScraps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(0);

  const getMyScrap = async () => {
    try {
      const res = await axios({
        method: 'post',
        url: `${baseUrl}/api/user/get_my_scraps`,
        headers: {
          authorization: token,
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
        data: qs.stringify({
          page: fetchingStatus ? pageCurrent + 1 : false,
        }),
      });

      if (res.data.result === 'success') {
        setMyScraps(myScraps.concat(res.data.data));
        setFetchingStatus(res.data.data.length !== 0);
        setIsLoading(false);
        setPageCurrent(pageCurrent + 1);
      } else {
        setFetchingStatus(false);
        setIsLoading(true);
        setPageCurrent(pageCurrent + 1);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    getMyScrap();
  }, []);

  console.log('[SCRAPS] ', myScraps);

  const title = route.params.title;

  // ToTop 스크롤
  const scrollRef = useRef();
  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleScroll = (e) => {
    const scrollY =
      e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
    if (scrollY >= e.nativeEvent.contentSize.height - 250) {
      getMyScrap();
    }
  };

  const RenderRow = ({item, idx}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          const addr =
            item.sc_category === 'curation' ? 'CurationDetail' : 'TripDetail';
          navigation.navigate(addr, {
            title: item.title,
            id: item.sc_ref_id,
          });
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingHorizontal: 20,
          marginVertical: 20,
        }}
        key={item.sc_id}>
        <View>
          {item.files.length > 0 ? (
            <ImageBackground
              source={{
                uri: `${baseUrl}${item.files[0].ft_file_path}`,
              }}
              resizeMode="cover"
              style={{
                position: 'relative',
                width: 80,
                height: 80,
                marginRight: 15,
              }}
              imageStyle={{borderRadius: 10}}>
              {item.files.length > 1 ? (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderTopLeftRadius: 10,
                  }}>
                  <Text>{item.files.length}</Text>
                </View>
              ) : null}
            </ImageBackground>
          ) : null}
        </View>
        <View style={{width: '67%'}}>
          <Text
            style={{
              flex: 1,
              flexWrap: 'wrap',
              fontSize: 18,
              fontWeight: 'bold',
              width: '100%',
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text style={{fontSize: 16, color: '#666666'}}>스크랩한 날짜</Text>
          <Text style={{fontSize: 16, color: '#666666'}}>
            {moment(item.sc_created_at).format('YYYY/MM/DD')}
          </Text>
        </View>
      </TouchableOpacity>
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

  return (
    <Container>
      <Header navigation={navigation} title={title} />
      <ScrollView contentContainerStyle={{flexGrow: 1}} ref={scrollRef}>
        {/* List */}
        {myScraps ? (
          <FlatList
            data={myScraps}
            renderItem={RenderRow}
            keyExtractor={(list, index) => index.toString()}
            onScroll={(event) => handleScroll(event)}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            scrollEnabled
            nestedScrollEnabled
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>아직 스크랩한 내용이 없습니다.</Text>
          </View>
        )}
      </ScrollView>
      {myScraps.length > 10 ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressTouch}
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
            elevation: 0,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#222222',
            }}>
            Top
          </Text>
        </TouchableOpacity>
      ) : null}
    </Container>
  );
};

export default ScrapScreen;
