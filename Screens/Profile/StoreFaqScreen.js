import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {Container, Content, Input} from 'native-base';
import qs from 'qs';
import Header from '../Common/Header';
import {useSelector} from 'react-redux';
import {VegasPost} from '../../utils/axios.config';

const StoreFaqScreen = (props) => {
  const navigation = props.navigation;
  const title = props.route.params.title;
  const token = useSelector((state) => state.Reducer.token);
  console.log('스토어 입점 문의 토큰 : ', token);

  const [siName, setSiName] = useState(null);
  const [siCategory, setSiCategory] = useState(null);
  const [siItem, setSiItem] = useState(null);
  const [siContact, setSiContact] = useState(null);

  const nameInputRef = useRef();
  const typeInputRef = useRef();
  const itemInputRef = useRef();
  const phoneInputRef = useRef();

  const onSubmit = () => {
    console.log('siName >?', siName);
    console.log('siCategory >?', siCategory);
    console.log('siItem >?', siItem);
    console.log('siContact >?', siContact);

    // return false;

    if (!token) {
      Alert.alert('로그인이 필요합니다.', '로그인 페이지로 이동', [
        {
          text: '확인',
          onPress: () => navigation.navigate('login'),
        },
        {
          text: '취소',
        },
      ]);
    } else if (siName === '' || siName === null) {
      Alert.alert('업체상호를 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => nameInputRef.current._root.focus(),
        },
      ]);
    } else if (siCategory === '' || siCategory === null) {
      Alert.alert('업종를 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => typeInputRef.current._root.focus(),
        },
      ]);
    } else if (siItem === '' || siItem === null) {
      Alert.alert('주요판매 물건/메뉴를 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => itemInputRef.current._root.focus(),
        },
      ]);
    } else if (siContact === '' || siContact === null) {
      Alert.alert('연락처를 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => phoneInputRef.current._root.focus(),
        },
      ]);
    } else {
      VegasPost(
        '/api/store/add_store_inquiry',
        qs.stringify({
          si_name: siName,
          si_category: siCategory,
          si_item: siItem,
          si_contact: siContact,
        }),
        {headers: {authorization: `${token}`}},
      )
        .then((res) => {
          console.log('입점 신청 결과 :', res);
          if (res.result === 'success') {
            navigation.navigate('storeFaqCom', {title: '입점문의 완료'});
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // width 100%, height auto 설정
  const win = Dimensions.get('window');
  const ratio = win.width / 1472;

  return (
    <Container>
      <Header navigation={navigation} title={title} />
      <ScrollView>
        <Content>
          {/* <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Image
              source={require('../src/assets/img/inquiry.png')}
              resizeMode="contain"
              style={{
                width: win.width,
                height: 2000 * ratio,
                // borderRadius: 15,
                alignSelf: 'center',
              }}
            />
          </View> */}
          <View style={{marginVertical: 20}}>
            <Text style={{fontSize: 28, textAlign: 'center'}}>입점신청</Text>
          </View>

          {/* 각 입력란 */}
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 5}}>업체상호</Text>
            <View>
              <Input
                ref={nameInputRef}
                placeholder="입력해주세요"
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5,
                }}
                value={siName}
                onChangeText={(name) => setSiName(name)}
                autoFocus
                autoCapitalize="none"
                returnKeyLabel="다음"
                returnKeyType="next"
                onSubmitEditing={() => typeInputRef.current._root.focus()}
              />
            </View>
          </View>

          {/* 각 입력란 */}
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 5}}>업종</Text>
            <View>
              <Input
                ref={typeInputRef}
                placeholder="입력해주세요"
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5,
                }}
                value={siCategory}
                onChangeText={(category) => setSiCategory(category)}
                autoCapitalize="none"
                returnKeyLabel="다음"
                returnKeyType="next"
                onSubmitEditing={() => itemInputRef.current._root.focus()}
              />
            </View>
          </View>

          {/* 각 입력란 */}
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 5}}>
              주요판매 물건/메뉴
            </Text>
            <View>
              <Input
                ref={itemInputRef}
                placeholder="입력해주세요"
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5,
                }}
                value={siItem}
                onChangeText={(item) => setSiItem(item)}
                autoCapitalize="none"
                returnKeyLabel="다음"
                returnKeyType="next"
                onSubmitEditing={() => phoneInputRef.current._root.focus()}
              />
            </View>
          </View>

          {/* 각 입력란 */}
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 5}}>연락처</Text>
            <View>
              <Input
                ref={phoneInputRef}
                placeholder="입력해주세요"
                placeholderTextColor="#E3E3E3"
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5,
                }}
                value={siContact}
                onChangeText={(contact) => setSiContact(contact)}
                autoCapitalize="none"
                returnKeyLabel="전송"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </View>
          </View>

          {/* 입점신청 버튼 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 30,
              marginBottom: 80,
            }}>
            <TouchableOpacity activeOpacity={0.7} onPress={onSubmit}>
              <Text
                style={{
                  backgroundColor: '#4A26F4',
                  paddingHorizontal: 70,
                  paddingVertical: 15,
                  borderRadius: 30,
                  fontSize: 18,
                  color: '#fff',
                }}>
                입점신청
              </Text>
            </TouchableOpacity>
          </View>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default StoreFaqScreen;
