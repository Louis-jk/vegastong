import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, Alert, ScrollView} from 'react-native';
import {Container, Content} from 'native-base';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Header from '../Common/Header';
import {VegasGet} from '../../utils/axios.config';

const terms = (props) => {
  const navigation = props.navigation;
  const title = props.route.params.title;
  console.log('사용자 이용약관 props : ', props);

  const [comInfo, setComInfo] = useState([]);

  useEffect(() => {
    VegasGet('/api/common/get_cor_info/usage/')
      .then((res) => {
        if (res.result === 'success') {
          setComInfo(res.data);
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
      <ScrollView>
        <AutoHeightWebView
          source={{
            html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" maximum-scale=1.0 user-scalable="no"><body><style>body{width:100vw; padding-top:5px; font-size:16px; line-height:26px;} h1{font-size:1.4rem;} h2{font-size:1.2rem} li{list-style:none;}</style>${comInfo.co_content}<div style="display:block; width:100%; height:50px; margin-bottom:30px;"></div></body></html>`,
          }}
          style={{
            flex: 1,
            width: Dimensions.get('window').width - 40,
            marginTop: 10,
            alignSelf: 'center',
          }}
        />
      </ScrollView>
    </Container>
  );
};

export default terms;
