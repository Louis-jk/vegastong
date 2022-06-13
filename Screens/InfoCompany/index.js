import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, Alert, ScrollView} from 'react-native';
import {Container, Content} from 'native-base';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
import qs from 'qs';
import axios from 'axios';
import Header from '../Common/Header';

const baseUrl = 'https://dmonster1826.cafe24.com';

const index = (props) => {
  const navigation = props.navigation;
  const title = props.route.params.title;
  console.log('사용자 이용약관 props : ', props);

  const [comInfo, setComInfo] = useState([]);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/common/get_cor_info/introduction/`,
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        if (res.data.result == 'success') {
          setComInfo(res.data.data);
        } else {
          Alert.alert('해당 사항이 없습니다.');
        }
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(comInfo);

  return (
    <Container>
      <Header navigation={navigation} title={title} />

      {comInfo !== null ? (
        <ScrollView>
          <AutoHeightWebView
            source={{
              // html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" maximum-scale=1.0 user-scalable="no"><body><style>li{list-style:none;}</style>${comInfo.co_content}</body></html>`,
              // html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" maximum-scale=1.0 user-scalable="no"><body><style>body{font-size:14px;} li{list-style:none;}</style>${comInfo.co_content}</body></html>`,
              html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" maximum-scale=1.0 user-scalable="no"><body><style>body{width:100vw; padding-top:5px; font-size:14px; line-height:22px;} h1{font-size:1.4rem;} h2{font-size:1.2rem} li{list-style:none;}</style>${comInfo.co_content}<div style="display:block; width:100%; height:50px; margin-bottom:30px;"></div></body></html>`,
            }}
            style={{
              width: Dimensions.get('window').width,
              marginHorizontal: 5,
              marginVertical: 35,
            }}
            scalesPageToFit={false}
            viewportContent={'width=device-width, user-scalable=no'}
          />
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>작성된 내용이 없습니다.</Text>
        </View>
      )}
    </Container>
  );
};

export default index;
