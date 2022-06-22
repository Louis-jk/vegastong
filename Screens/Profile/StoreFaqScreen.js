import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native'
import { Container, Content, Input, Textarea } from 'native-base'
import qs from 'qs'
import Header from '../Common/Header'
import { useSelector } from 'react-redux'
import { VegasPost } from '../../utils/axios.config'

const StoreFaqScreen = (props) => {
  const navigation = props.navigation
  const title = props.route.params.title
  const token = useSelector((state) => state.Reducer.token)
  console.log('스토어 입점 문의 토큰 : ', token)

  const [siName, setSiName] = useState(null)
  const [siDate, setSiDate] = useState(null)
  const [siTime, setSiTime] = useState(null)
  const [siPerson, setSiPerson] = useState(null)
  const [siContent, setSiContent] = useState(null)
  const [siContact, setSiContact] = useState(null)

  const nameInputRef = useRef() // 쇼/호텔 명 텍스트폼
  const dateInputRef = useRef() // 날짜 텍스트폼
  const timeInputRef = useRef() // 시간 텍스트폼
  const personInputRef = useRef() // 인원 텍스트폼
  const contentInputRef = useRef() // 문의내용 텍스트폼
  const phoneInputRef = useRef() // 연락처 텍스트폼

  const onSubmit = () => {
    console.log('siName >?', siName)
    console.log('siDate >?', siDate)
    console.log('siContent >?', siContent)
    console.log('siContact >?', siContact)

    // return false;

    if (!token) {
      Alert.alert('로그인이 필요합니다.', '로그인 페이지로 이동', [
        {
          text: '확인',
          onPress: () => navigation.navigate('login')
        },
        {
          text: '취소'
        }
      ])
    } else if (siName === '' || siName === null) {
      Alert.alert('쇼/호텔 명을 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => nameInputRef.current._root.focus()
        }
      ])
    } else if (siDate === '' || siDate === null) {
      Alert.alert('날짜를 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => dateInputRef.current._root.focus()
        }
      ])
    } else if (siTime === '' || siTime === null) {
      Alert.alert('시간을 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => timeInputRef.current._root.focus()
        }
      ])
    } else if (siPerson === '' || siPerson === null) {
      Alert.alert('인원을 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => personInputRef.current._root.focus()
        }
      ])
    } else if (siContent === '' || siContent === null) {
      Alert.alert('문의내용을 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => contentInputRef.current._root.focus()
        }
      ])
    } else if (siContact === '' || siContact === null) {
      Alert.alert('연락처를 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => phoneInputRef.current._root.focus()
        }
      ])
    } else {
      VegasPost(
        '/api/store/add_store_inquiry',
        qs.stringify({
          si_name: siName,
          si_date: siDate,
          si_time: siTime,
          si_person_count: siPerson,
          si_content: siContent,
          si_contact: siContact
        }),
        { headers: { authorization: `${token}` } }
      )
        .then((res) => {
          console.log('입점 신청 결과 :', res)
          if (res.result === 'success') {
            navigation.navigate('storeFaqCom', { title: '입점문의 완료' })
          }
        })
        .catch((err) => console.log(err))
    }
  }

  // width 100%, height auto 설정
  const win = Dimensions.get('window')
  const ratio = win.width / 1472

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
          <View style={{ marginVertical: 20 }}>
            <Text style={{ fontSize: 28, textAlign: 'center' }}>컨시어지</Text>
          </View>

          {/* 각 입력란 */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>쇼/호텔</Text>
            <View>
              <Input
                ref={nameInputRef}
                placeholder='쇼/호텔 명을 입력해주세요'
                placeholderTextColor='#E3E3E3'
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5
                }}
                value={siName}
                onChangeText={(name) => setSiName(name)}
                autoFocus
                autoCapitalize='none'
                returnKeyLabel='다음'
                returnKeyType='next'
                onSubmitEditing={() => dateInputRef.current._root.focus()}
              />
            </View>
          </View>

          {/* 각 입력란 */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>날짜</Text>
            <View>
              <Input
                ref={dateInputRef}
                placeholder='0000-00-00 (예:2022-06-20)'
                placeholderTextColor='#E3E3E3'
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5
                }}
                value={siDate}
                onChangeText={(text) => setSiDate(text)}
                autoCapitalize='none'
                returnKeyLabel='다음'
                returnKeyType='next'
                onSubmitEditing={() => timeInputRef.current._root.focus()}
              />
            </View>
          </View>

          {/* 각 입력란 */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>시간</Text>
            <View>
              <Input
                ref={timeInputRef}
                placeholder='00:00 (예: 17:00)'
                placeholderTextColor='#E3E3E3'
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5
                }}
                value={siTime}
                onChangeText={(text) => setSiTime(text)}
                autoCapitalize='none'
                returnKeyLabel='다음'
                returnKeyType='next'
                onSubmitEditing={() => personInputRef.current._root.focus()}
              />
            </View>
          </View>

          {/* 각 입력란 */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>인원</Text>
            <View>
              <Input
                ref={personInputRef}
                placeholder='00 (예: 2)'
                placeholderTextColor='#E3E3E3'
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5
                }}
                value={siPerson}
                onChangeText={(text) => setSiPerson(text)}
                autoCapitalize='none'
                returnKeyLabel='다음'
                returnKeyType='next'
                onSubmitEditing={() => contentInputRef.current._root.focus()}
              />
            </View>
          </View>

          {/* 각 입력란 */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>문의내용</Text>
            <View>
              <Textarea
                rowSpan={5}
                ref={contentInputRef}
                placeholder='문의내용을 입력해주세요'
                value={siContent}
                onChangeText={(item) => setSiContent(item)}
                autoCapitalize='none'
                returnKeyLabel='다음'
                returnKeyType='next'
                onSubmitEditing={() => phoneInputRef.current._root.focus()}
                bordered
                borderColor='#eee'
                borderRadius={10}
                placeholderTextColor='#E3E3E3'
                paddingLeft={15}
                fontSize={17}
              />
              {/* <Input
                ref={timeInputRef}
                placeholder='문의내용을 입력해주세요'
                placeholderTextColor='#E3E3E3'
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5
                }}
                numberOfLines={5}
                multiline
                value={siContent}
                onChangeText={(item) => setSiContent(item)}
                autoCapitalize='none'
                returnKeyLabel='다음'
                returnKeyType='next'
                onSubmitEditing={() => phoneInputRef.current._root.focus()}
              /> */}
            </View>
          </View>

          {/* 각 입력란 */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>연락처</Text>
            <View>
              <Input
                ref={phoneInputRef}
                placeholder='연락처를 입력해주세요'
                placeholderTextColor='#E3E3E3'
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5
                }}
                value={siContact}
                onChangeText={(contact) => setSiContact(contact)}
                autoCapitalize='none'
                returnKeyLabel='전송'
                returnKeyType='send'
                onSubmitEditing={onSubmit}
              />
            </View>
          </View>

          {/* 문의하기 버튼 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 30,
              marginBottom: 80
            }}
          >
            <TouchableOpacity activeOpacity={0.7} onPress={onSubmit}>
              <Text
                style={{
                  backgroundColor: '#4A26F4',
                  paddingHorizontal: 70,
                  paddingVertical: 15,
                  borderRadius: 30,
                  fontSize: 18,
                  color: '#fff'
                }}
              >
                문의하기
              </Text>
            </TouchableOpacity>
          </View>
        </Content>
      </ScrollView>
    </Container>
  )
};

export default StoreFaqScreen
