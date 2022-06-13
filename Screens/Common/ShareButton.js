import React from 'react';
import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';

const ShareButton = (props) => {
  const {toggleShareModal, shareKakao} = props;

  return (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      <TouchableOpacity onPress={shareKakao} activeOpacity={0.8}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#EAEAEA',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 30,
            width: 120,
            marginBottom: Platform.OS === 'ios' ? 50 : 20,
            backgroundColor: '#fff',
          }}>
          <Image
            source={require('../src/assets/img/ic_share.png')}
            style={{
              width: 18,
              height: 18,
              marginRight: 7,
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              alignSelf: 'center',
              color: '#A0A0A0',
              fontWeight: 'bold',
              marginTop: -1,
            }}>
            공유
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ShareButton;
