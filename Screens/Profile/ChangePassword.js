import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { Container, Content, Input } from 'native-base'
import { useSelector } from 'react-redux'
import qs from 'qs'

import Header from '../Common/Header'
import { VegasPost } from '../../utils/axios.config'

const ChangePassword = (props) => {
  const navigation = props.navigation
  const title = props.route.params.title

  const { token } = useSelector((state) => state.Reducer)

  const [oldPassword, inputOldPassword] = useState(null)
  const [newPassword, inputNewPassword] = useState(null)

  const onSubmit = () => {
    if (!oldPassword && !newPassword) {
      Alert.alert('비밀번호를 입력해주세요.')
    } else {
      VegasPost(
        '/api/user/change_password',
        qs.stringify({
          old_password: oldPassword,
          new_password: newPassword
        }),
        { headers: { authorization: `${token}` } }
      ).then((res) => {
        if (res.data.result === 'fail') {
          Alert.alert(`${res.data.error}`)
        } else if (res.data.result === 'success') {
          Alert.alert(
            '비밀번호가 변경되었습니다.',
            '변경하신 비밀번호로 사용 가능하십니다.',
            [
              {
                text: '확인',
                onPress: () => navigation.navigate('home')
              }
            ]
          )
        }
      })
    }
  }

  return (
    <Container>
      <Header navigation={navigation} title={title} />
      <Content>
        {/* 비밀번호 변경 */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <Text style={{ fontSize: 18, marginBottom: 5 }}>비밀번호 변경</Text>
          <View>
            <Input
              placeholder='기존 비밀번호를 입력해주세요.'
              placeholderTextColor='#E3E3E3'
              style={{
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#eee',
                borderRadius: 10,
                paddingLeft: 15,
                marginBottom: 5
              }}
              // value={inputPassword}
              onChangeText={(text) => inputOldPassword(text)}
              autoCapitalize='none'
              secureTextEntry
            />
          </View>
          <View>
            <Input
              placeholder='새로 사용하실 비밀번호를 입력해주세요.'
              placeholderTextColor='#E3E3E3'
              style={{
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#eee',
                borderRadius: 10,
                paddingLeft: 15,
                marginBottom: 5
              }}
              // value={inputPassword}
              onChangeText={(text) => inputNewPassword(text)}
              autoCapitalize='none'
              secureTextEntry
            />
          </View>
          <Text style={{ fontSize: 14, color: '#666666' }}>
            비밀번호는 8자리 이상 16자리 이하로 입력해주세요.
          </Text>
        </View>
        {/* 수정하기 버튼 */}
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
              수정하기
            </Text>
          </TouchableOpacity>
        </View>
      </Content>
    </Container>
  )
};

export default ChangePassword
