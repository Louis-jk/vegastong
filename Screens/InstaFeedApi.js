import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import qs from 'qs';
import axios from 'axios';

const {width: screenWidth} = Dimensions.get('window');

const InstaFeedApi = () => {
  const [instaFeed, setInstaFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getInstaFeed = async () => {
    try {
      await axios({
        method: 'get',
        url: 'https://gongjuro.com/api/common/get_instagram',
        headers: {
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
          'Content-Type': 'application/json',
        },
      })
        .then((res) => setInstaFeed(res.data))
        .then(setIsLoading(false))
        .catch((err) => console.log(err));
    } catch (err) {
      Alert.alert(`${err.message()}`);
      setIsLoading(true);
    }
  };

  console.log('instaFeed Reset :: ', instaFeed);
  // console.log('instaFeed Data :: ', instaFeed.data);

  useEffect(() => {
    getInstaFeed();
    return () => {
      getInstaFeed();
    };
  }, []);

  const OpenURLButton = async (url) => {
    // Checking if the link is supported for links with custom URL scheme.

    const supported = await Linking.canOpenURL(`${url}`);

    if (supported) {
      await Linking.openURL(`${url}`);
    } else {
      Alert.alert('이 게시물을 찾을 수 없습니다.', '관리자에게 문의하세요.', [
        {
          text: '확인',
          onPress: () => {},
        },
      ]);
    }
  };

  const MARGIN = 2;
  const w = screenWidth - 45;

  return (
    // <View>
    //   <Text></Text>
    // </View>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#4A26F4"
          style={{marginLeft: 4}}
        />
      ) : instaFeed.length > 0 || instaFeed !== null ? (
        instaFeed.map((i, idx) => (
          <TouchableOpacity
            key={i.id}
            activeOpacity={0.8}
            onPress={() => OpenURLButton(`${i.permalink}`)}
            style={{
              margin: 0,
              padding: 0,
              marginBottom: 2,
            }}>
            <Image
              source={{uri: `${i.media_url}`}}
              style={{
                width:
                  idx === 0
                    ? Dimensions.get('window').width / 3.45 - MARGIN
                    : Dimensions.get('window').width / 3.45 - MARGIN,
                height:
                  idx === 0
                    ? Dimensions.get('window').width / 3.45 - MARGIN
                    : Dimensions.get('window').width / 3.45 - MARGIN,
                padding: 0,
                margin: 0,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))
      ) : (
        <View>
          <Text>새로운 소식이 없습니다.</Text>
        </View>
      )}
    </View>
  );
};

export default InstaFeedApi;
