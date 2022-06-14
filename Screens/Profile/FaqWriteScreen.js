import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native'
import { Container, Content, Input, Textarea, Form } from 'native-base'
import qs from 'qs'
import Header from '../Common/Header'
import { VegasGet, VegasPost } from '../../utils/axios.config'

const FaqWriteScreen = (props) => {
  const navigation = props.navigation
  const { title, token } = props.route.params
  console.log(props)

  const [faqTitle, writeFaqTitle] = useState('')
  const [faqDesc, writeFaqDesc] = useState('')
  const [faqLists, setFaqLists] = useState(null)

  const getMyFaqList = () => {
    VegasGet(
      '/api/inquiry/get_my_inquiries',
      {},
      { headers: { authorization: `${token}` } }
    )
      .then((res) => {
        if (res.result === 'success') {
          setFaqLists(res.data)
        } else {
          setFaqLists(null)
        }
      })
      .catch((err) => console.log(err))
  };

  const postMyFaq = () => {
    if (!faqTitle) {
      Alert.alert('제목을 입력해주세요.', '입력란을 작성해주세요.', [
        {
          text: '확인',
          onPress: () => {}
        }
      ])
    } else if (!faqDesc) {
      Alert.alert('내용을 입력해주세요.', '입력란을 작성해주세요.', [
        {
          text: '확인',
          onPress: () => {}
        }
      ])
    } else {
      VegasPost(
        '/api/inquiry/add_inquiry',
        qs.stringify({
          iq_title: faqTitle,
          iq_content: faqDesc
        }),
        {
          headers: {
            authorization: `${token}`
          }
        }
      )
        .then(() => {
          getMyFaqList()
          navigation.navigate('userFaq')
        })
        .catch((err) => console.log(err))
    }
  }

  console.log('1:1문의쓰기 토큰 : ', token)

  return (
    <Container
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}
    >
      <Header navigation={navigation} title={title} />
      <ScrollView>
        <Content>
          <View style={{ marginTop: 30 }} />

          {/* 제목 입력 */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>제목</Text>
            <View>
              <Input
                placeholder='입력해주세요'
                placeholderTextColor='#E3E3E3'
                onChangeText={(title) => writeFaqTitle(title)}
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 10,
                  paddingLeft: 15,
                  marginBottom: 5
                }}
                autoCapitalize='none'
                autoFocus
              />
            </View>
          </View>

          {/* 내용 입력 */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>내용</Text>
            <View>
              <Form>
                <Textarea
                  rowSpan={10}
                  placeholder='입력해주세요'
                  placeholderTextColor='#E3E3E3'
                  onChangeText={(content) => writeFaqDesc(content)}
                  style={{
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: '#eee',
                    borderRadius: 10,
                    paddingLeft: 15,
                    marginBottom: 5
                  }}
                  autoCapitalize='none'
                />
              </Form>
            </View>
          </View>

          {/* 글쓰기 버튼 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 100,
              marginBottom: 80
            }}
          >
            <TouchableOpacity activeOpacity={0.7} onPress={postMyFaq}>
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
                글쓰기
              </Text>
            </TouchableOpacity>
          </View>
        </Content>
      </ScrollView>
    </Container>
  )
};

export default FaqWriteScreen
