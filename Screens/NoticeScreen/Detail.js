import * as React from 'react'
import { View, Text, Alert, Dimensions, TouchableOpacity } from 'react-native'
import { Container } from 'native-base'

import WebView from 'react-native-webview'
import AutoHeightWebView from 'react-native-autoheight-webview'
import 'moment/locale/ko'
import moment from 'moment'
import Header from '../Common/Header'
import { VegasGet } from '../../utils/axios.config'

const Detail = (props) => {
  const navigation = props.navigation
  const { title, id } = props.route.params

  const [notice, setNotice] = React.useState([])
  React.useEffect(() => {
    VegasGet(`/api/notice/get_notice/${id}`)
      .then((res) => {
        if (res.result === 'success') {
          setNotice(res.data)
        } else {
          setNotice([])
        }
      })
      .catch((err) => {
        Alert.alert(
          '공지사항을 가져오지 못했습니다.\n관리자에게 문의하세요.',
          `오류: ${err}`,
          [
            {
              text: '확인',
              onPress: () => {}
            }
          ]
        )
      })
  }, [])

  console.log('notice : ', notice)

  return (
    <Container>
      <Header navigation={navigation} title={title} />
      <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
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
                marginBottom: 10
              }}
            >
              <Text style={{ fontSize: 14, lineHeight: 24, color: '#fff' }}>
                이벤트
              </Text>
            </View>
            <Text style={{ fontSize: 18, lineHeight: 28, marginBottom: 20 }}>
              {notice.no_title}
            </Text>
          </View>
        ) : (
          <Text style={{ fontSize: 18, lineHeight: 28, marginBottom: 20 }}>
            {notice.no_title}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 14, color: '#666666' }}>
            {moment(notice.no_updated_at).format('YYYY/MM/DD')}
          </Text>
          <Text style={{ fontSize: 14, color: '#666666' }}>
            {notice.no_views} 열람
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#eaeaea',
          marginVertical: 20
        }}
      />
      <AutoHeightWebView
        source={{
          html: `${notice.no_content}`
        }}
        style={{
          width: Dimensions.get('window').width - 40,
          alignSelf: 'center',
          marginBottom: 50
        }}
        customScript={"document.body.style.background = 'transparent';"}
        onSizeUpdated={(size) => console.log(size.height)}
        files={[
          {
            href: 'cssfileaddress',
            type: 'text/css',
            rel: 'stylesheet'
          }
        ]}
        scalesPageToFit={false}
        viewportContent='width=device-width, user-scalable=no'
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 30
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('notice', { title: '이전' })}
          underlayColor='#eaeaea'
          style={{
            borderWidth: 1,
            borderColor: '#EAEAEA',
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 20,
            marginRight: 5
          }}
        >
          <Text>목록</Text>
        </TouchableOpacity>
      </View>
    </Container>
  )
};

export default Detail
