import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Container, Content} from 'native-base';
import {WebView} from 'react-native-webview';
import {RadioButton} from 'react-native-paper';
import Config from 'react-native-config';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';

import BottomTabs from '../Common/BottomTabs';
import Selector from './Selector';

Icon.loadFont();

const BASE_URL = Config.BASE_URL;
const LOCAL_TRIP_URL = `${BASE_URL}/home/local_to_trip`;

const TripScreen = ({navigation, route}) => {
  const routeName = route.name;

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible(!isModalVisible);

  const [checked, setChecked] = useState('스트립/다운타운');
  const [postMessage, setPostMessage] = useState('');

  const patchPostMessageFunction = () => {
    const originalPostMessage = window.postMessage;

    const patchedPostMessage = function (message, targetOrigin, transfer) {
      originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function () {
      return String(Object.hasOwnProperty).replace(
        'hasOwnProperty',
        'postMessage',
      );
    };

    window.postMessage = patchedPostMessage;
  };

  const setCheckedLocal = (v) => {
    setChecked(v);
    // ReactNativeWebView.sendMessage(JSON.stringify(checked));
    toggleModal();
  };

  const selectArea = (enVal, korVal) => {
    // this.webview.postMessage('store');
    console.log('enVal?', enVal);
    myWebView.postMessage(enVal);
    setCheckedLocal(korVal);
  };

  // useEffect(() => {
  //   selectArea('downtown')
  // }, [])

  let myWebView;

  return (
    <>
      <Container>
        {/* 모달 설정 */}
        <Modal
          isVisible={isModalVisible}
          animationIn="fadeIn"
          backdropOpacity={0.5}
          onBackdropPress={toggleModal}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            {/* 모달 전체 레이아웃 */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
              }}>
              {/* 지도 장소 셀렉트 */}
              <View>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => selectArea('downtown', '스트립/다운타운')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                  }}>
                  <Text style={{fontSize: 18, color: '#333', marginRight: 30}}>
                    스트립/다운타운
                  </Text>
                  <RadioButton
                    value="스트립/다운타운"
                    status={
                      checked === '스트립/다운타운' ? 'checked' : 'unchecked'
                    }
                    color="#4A26F4"
                    onPress={() => selectArea('downtown', '스트립/다운타운')}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E3E3E3',
                  }}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => selectArea('tour', '주변관광지')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                  }}>
                  <Text style={{fontSize: 18, color: '#333', marginRight: 30}}>
                    주변관광지
                  </Text>
                  <RadioButton
                    value="주변관광지"
                    status={checked === '주변관광지' ? 'checked' : 'unchecked'}
                    color="#4A26F4"
                    onPress={() => selectArea('tour', '주변관광지')}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E3E3E3',
                  }}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => selectArea('hotel', '호텔/골프')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                  }}>
                  <Text style={{fontSize: 18, color: '#333', marginRight: 30}}>
                    호텔/골프
                  </Text>
                  <RadioButton
                    value="호텔/골프"
                    status={checked === '호텔/골프' ? 'checked' : 'unchecked'}
                    color="#4A26F4"
                    onPress={() => selectArea('hotel', '호텔/골프')}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E3E3E3',
                  }}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => selectArea('store', '쇼핑/한인업소')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                  }}>
                  <Text style={{fontSize: 18, color: '#333', marginRight: 30}}>
                    쇼핑/한인업소
                  </Text>
                  <RadioButton
                    value="쇼핑/한인업소"
                    status={
                      checked === '쇼핑/한인업소' ? 'checked' : 'unchecked'
                    }
                    onPress={() => selectArea('store', '쇼핑/한인업소')}
                    color="#4A26F4"
                  />
                </TouchableOpacity>
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
          source={{uri: `${LOCAL_TRIP_URL}/local_to_trip`}}
          style={{flex: 1}}
          onMessage={(e) =>
            navigation.navigate('TripDetail', {id: e.nativeEvent.data})
          }
        />
        {/* url + /v-store */}
      </Container>
      <BottomTabs navigation={navigation} routeName={routeName} />
    </>
  );
};

export default TripScreen;
