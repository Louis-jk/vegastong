import * as React from 'react';
import {View, Text, Alert, Dimensions, TouchableOpacity} from 'react-native';
import {Container} from 'native-base';
import qs from 'qs';
import axios from 'axios';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
import 'moment/locale/ko';
import moment from 'moment';
import Header from '../Common/Header';

const baseUrl = 'https://dmonster1826.cafe24.com';

const Detail = (props) => {
  const navigation = props.navigation;
  const {title, id} = props.route.params;

  const [notice, setNotice] = React.useState([]);
  React.useEffect(() => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/notice/get_notice/${id}`,
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        if ((res.data.result = 'success')) {
          setNotice(res.data.data);
        }
      })
      .catch((err) => {
        Alert.alert('통신 장애가 있습니다.', '관리자에게 문의하세요.', [
          {
            text: '확인',
            onPress: () => {},
          },
        ]);
      });
  }, []);

  console.log('notice : ', notice);

  return (
    <Container>
      <Header navigation={navigation} title={title} />
      <View style={{paddingHorizontal: 20, marginTop: 30}}>
        {notice.no_is_event === '1' ? (
          <View>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#4A26F4',
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 14, lineHeight: 24, color: '#fff'}}>
                이벤트
              </Text>
            </View>
            <Text style={{fontSize: 18, lineHeight: 28, marginBottom: 20}}>
              {notice.no_title}
            </Text>
          </View>
        ) : (
          <Text style={{fontSize: 18, lineHeight: 28, marginBottom: 20}}>
            {notice.no_title}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, color: '#666666'}}>
            {moment(notice.no_updated_at).format('YYYY/MM/DD')}
          </Text>
          <Text style={{fontSize: 14, color: '#666666'}}>
            {notice.no_views} 열람
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#eaeaea',
          marginVertical: 20,
        }}
      />
      <AutoHeightWebView
        source={{
          html: `${notice.no_content}`,
        }}
        style={{
          width: Dimensions.get('window').width - 40,
          alignSelf: 'center',
          marginBottom: 50,
        }}
        customScript={"document.body.style.background = 'transparent';"}
        onSizeUpdated={(size) => console.log(size.height)}
        files={[
          {
            href: 'cssfileaddress',
            type: 'text/css',
            rel: 'stylesheet',
          },
        ]}
        scalesPageToFit={false}
        viewportContent="width=device-width, user-scalable=no"
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('notice', {title: '이전'})}
          underlayColor="#eaeaea"
          style={{
            borderWidth: 1,
            borderColor: '#EAEAEA',
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 20,
            marginRight: 5,
          }}>
          <Text>목록</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default Detail;
