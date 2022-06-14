import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Container, Content } from 'native-base'
import { WebView } from 'react-native-webview'
import { RadioButton } from 'react-native-paper'
import Config from 'react-native-config'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/Ionicons'

import BottomTabs from '../Common/BottomTabs'
import Selector from './Selector'

Icon.loadFont()

const BASE_URL = Config.BASE_URL
const LOCAL_TRIP_URL = `${BASE_URL}/home/local_to_trip`

const TripScreen = ({ navigation, route }) => {
  const routeName = route.name

  const [isModalVisible, setModalVisible] = useState(false)
  const toggleModal = () => setModalVisible(!isModalVisible)

  const [checked, setChecked] = useState('베가스주변')
  const [postMessage, setPostMessage] = useState('')

  const patchPostMessageFunction = () => {
    const originalPostMessage = window.postMessage

    const patchedPostMessage = function (message, targetOrigin, transfer) {
      originalPostMessage(message, targetOrigin, transfer)
    };

    patchedPostMessage.toString = function () {
      return String(Object.hasOwnProperty).replace(
        'hasOwnProperty',
        'postMessage'
      )
    };

    window.postMessage = patchedPostMessage
  };

  const setCheckedLocal = (v) => {
    setChecked(v)
    // ReactNativeWebView.sendMessage(JSON.stringify(checked));
    toggleModal()
  };

  const selectArea = (enVal, korVal) => {
    // this.webview.postMessage('store');
    console.log('enVal?', enVal)
    myWebView.postMessage(enVal)
    setCheckedLocal(korVal)
  };

  let myWebView

  return (
    <>
      <Container>
        {/* 모달 설정 */}
        <Modal
          isVisible={isModalVisible}
          animationIn='fadeIn'
          backdropOpacity={0.5}
          onBackdropPress={toggleModal}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {/* 모달 전체 레이아웃 */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10
              }}
            >
              {/* 지도 장소 셀렉트 */}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 15
                  }}
                >
                  <Text style={{ fontSize: 18, color: '#333', marginRight: 30 }}>
                    베가스주변
                  </Text>
                  <RadioButton
                    value='베가스주변'
                    status={checked === '베가스주변' ? 'checked' : 'unchecked'}
                    onPress={() => selectArea('vegas', '베가스주변')}
                    color='#4A26F4'
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E3E3E3'
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 15
                  }}
                >
                  <Text style={{ fontSize: 18, color: '#333', marginRight: 30 }}>
                    국립공원
                  </Text>
                  <RadioButton
                    value='국립공원'
                    status={checked === '국립공원' ? 'checked' : 'unchecked'}
                    onPress={() => selectArea('park', '국립공원')}
                    color='#4A26F4'
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E3E3E3'
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 15
                  }}
                >
                  <Text style={{ fontSize: 18, color: '#333', marginRight: 30 }}>
                    호텔
                  </Text>
                  <RadioButton
                    value='호텔'
                    status={checked === '호텔' ? 'checked' : 'unchecked'}
                    onPress={() => selectArea('hotel', '호텔')}
                    color='#4A26F4'
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E3E3E3'
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 15
                  }}
                >
                  <Text style={{ fontSize: 18, color: '#333', marginRight: 30 }}>
                    골프
                  </Text>
                  <RadioButton
                    value='골프'
                    status={checked === '골프' ? 'checked' : 'unchecked'}
                    onPress={() => selectArea('golf', '골프')}
                    color='#4A26F4'
                  />
                </View>
              </View>
            </View>
            {/* //모달 전체 레이아웃 */}
          </View>
        </Modal>

        <Selector
          navigation={navigation}
          toggleModal={toggleModal}
          selected={checked}
        />
        <WebView
          ref={(el) => (myWebView = el)}
          source={{ uri: `${LOCAL_TRIP_URL}/local_to_trip` }}
          style={{ flex: 1 }}
          onMessage={(e) =>
            navigation.navigate('TripDetail', { id: e.nativeEvent.data })}
        />
        {/* url + /v-store */}
      </Container>
      <BottomTabs navigation={navigation} routeName={routeName} />
    </>
  )
};

export default TripScreen
