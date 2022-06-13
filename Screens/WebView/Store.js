import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Container} from 'native-base';
import {WebView} from 'react-native-webview';

const Store = ({navigation, route}) => {
  const routeName = route.params.text;

  return (
    <Container>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 20,
            width: '100%',
          }}>
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row'}}>
              <Image
                source={require('../src/assets/img/top_ic_close.png')}
                resizeMode="contain"
                style={{width: 25, height: 25, marginRight: 20}}
              />
              <Text
                style={{
                  fontSize: 18,
                }}>
                {routeName}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={require('../src/assets/img/top_ic_menu.png')}
                resizeMode="contain"
                style={{width: 60, height: 60}}
              />
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
      <WebView source={{uri: 'https://smartstore.naver.com/gongju-ro'}} />
    </Container>
  );
};

export default Store;
