import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions
} from 'react-native'
import { Container, Content } from 'native-base'
import { useSelector } from 'react-redux'
import Header from '../Common/Header'

const StoreFaqComScreen = (props) => {
  const navigation = props.navigation
  const title = props.route.params.title

  const { ut_nickname } = useSelector((state) => state.UserInfoReducer)

  return (
    <Container>
      <Header navigation={navigation} title={title} />
      <ScrollView>
        <Content>
          {/* 본문 */}

          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').height - 80
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {/* 현재 공주로 이미지, 입점문의 완료 이미지 */}
              <Image
                source={require('../src/assets/img/complete_img2.png')}
                resizeMode='contain'
                style={{ width: 200, height: 130, marginBottom: 30 }}
              />

              <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {ut_nickname}
                </Text>
                <Text style={{ fontSize: 24, color: '#666666' }}>
                  님 컨시어지 문의가
                </Text>
              </View>
              <View style={{ marginBottom: 15 }}>
                <Text
                  style={{ fontSize: 24, color: '#666666', marginBottom: 15 }}
                >
                  완료되었습니다.
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: '#666666', marginBottom: 2 }}>
                빠른시일내에 확인후 작성해주신
              </Text>
              <Text style={{ fontSize: 16, color: '#666666', marginBottom: 5 }}>
                연락처로 연락드리겠습니다.
              </Text>
            </View>

            {/* 확인 버튼 */}
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 30,
                  marginBottom: 80,
                  paddingHorizontal: 20
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('home')}
                >
                  <Text
                    style={{
                      backgroundColor: '#4A26F4',
                      paddingHorizontal: 80,
                      paddingVertical: 15,
                      borderRadius: 30,
                      fontSize: 18,
                      color: '#fff'
                    }}
                  >
                    확인
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Content>
      </ScrollView>
    </Container>
  )
};

export default StoreFaqComScreen
