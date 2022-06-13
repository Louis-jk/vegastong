import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import {Footer} from 'native-base';

const CompanyInfo = (props) => {
  const navigation = props.navigation;

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#F2F2F2',
      }}>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Terms', {title: '홈으로'})}>
          <Text style={{color: '#AFAFAF', fontSize: 14, paddingRight: 10}}>
            이용약관
          </Text>
        </TouchableWithoutFeedback>
        <Text style={{color: '#DFDFDF', fontSize: 14, paddingRight: 10}}>
          |
        </Text>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Privacy', {title: '홈으로'})}>
          <Text style={{fontSize: 14}}>개인정보 처리방침</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={{fontSize: 14, marginBottom: 10}}>
        <Text style={{fontSize: 14, lineHeight: 22, color: '#AFAFAF'}}>
          상호명 : (주)트래블공주 / 대표 : 신민혜
        </Text>
        <Text style={{fontSize: 14, lineHeight: 22, color: '#AFAFAF'}}>
          사업자등록번호 : 550-87-01261
        </Text>
        <TouchableOpacity
        // onPress={() => Linking.openURL('mailto:gongju-ro@naver.com')}
        >
          <Text style={{fontSize: 14, lineHeight: 22, color: '#AFAFAF'}}>
            E-mail: 베가스통 이메일
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{fontSize: 14, color: '#AFAFAF'}}>
        Copyright© (주)트래블공주 All rights reserved.
      </Text>
    </View>
  );
};

export default CompanyInfo;
