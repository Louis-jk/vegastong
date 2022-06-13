import Axios from 'axios';
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

const ScrapButton = (props) => {
  const {scrap, toggleScrap} = props;
  const {token} = useSelector((state) => state.Reducer);

  const loginInfo = () => {
    Alert.alert('회원만 댓글을 쓰실 수 있습니다.', '로그인 하시겠습니까?', [
      {
        text: '확인',
        onPress: () => props.navigation.navigate('login'),
      },
      {
        text: '취소',
        onPress: () => {},
      },
    ]);
  };

  return (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={token ? toggleScrap : loginInfo}
        activeOpacity={1}>
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
            source={
              scrap
                ? require('../src/assets/img/ic_scrap_on.png')
                : require('../src/assets/img/ic_scrap_off.png')
            }
            style={{
              width: 20,
              height: 20,
              marginRight: 2,
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
            스크랩
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ScrapButton;
