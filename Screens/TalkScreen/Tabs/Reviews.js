import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Alert
} from 'react-native'
import { Content, Thumbnail } from 'native-base'

import Config from 'react-native-config'
import qs from 'qs'
import { VegasPost } from '../../../utils/axios.config'

const BASE_URL = Config.BASE_URL

const Reviews = (props) => {
  const navigation = props.navigation
  const [reviews, setReviews] = useState([])

  const today = new Date()
  const talkUpdatedDay = (day) => {
    return new Date(day)
  };
  // const diffDay = Math.floor(
  //   (today.getTime() - talkUpdatedDay.getTime()) / (1000 * 60 * 60 * 24),
  // );

  useEffect(() => {
    VegasPost(
      '/api/talk/get_talks',
      qs.stringify({
        tk_division: 'review'
      })
    )
      .then((res) => {
        if (res.result === 'success') {
          setReviews(res.data)
        } else {
          setReviews([])
        }
      })
      .catch((err) => {
        setReviews([])
        Alert.alert(
          '리뷰를 불러오는데 문제가 발생하였습니다.\n관리자에게 문의하세요.',
          `${err}`,
          [
            {
              text: '확인'
            }
          ]
        )
      })
  }, [])

  return (
    <ScrollView>
      <Content style={{ marginTop: 30 }}>
        {/* Review 탭(이벤트참여) 1번째 리스트 */}
        {reviews.map((review) => (
          <View key={review.tk_id}>
            <View style={{ marginHorizontal: 20 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TalkDetail', {
                    title: review.tk_division,
                    ut_nickname: review.ut_nickname,
                    ut_image: review.ut_image,
                    tk_id: review.tk_id,
                    tk_content: review.tk_content,
                    files: review.files
                  })}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginBottom: 20
                  }}
                >
                  {!review.ut_image ? (
                    <Thumbnail
                      source={{
                        uri: 'https://aeealberta.org/wp-content/uploads/2018/10/profile.png'
                      }}
                      style={styles.thumbnailStyle}
                      resizeMode='cover'
                    />
                  ) : (
                    <Thumbnail
                      source={{
                        uri: `${BASE_URL}/${review.ut_image}`
                      }}
                      style={styles.thumbnailStyle}
                      resizeMode='cover'
                    />
                  )}
                  <View>
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#4A26F4',
                          marginRight: 5
                        }}
                      >
                        여행후기
                      </Text>
                      <Text style={{ fontSize: 16, color: '#000' }}>
                        {review.ut_nickname}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, color: '#888' }}>
                        {Math.floor(
                          (today.getTime() -
                            talkUpdatedDay(review.ar_updated_at).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                        일전
                      </Text>
                      <View
                        style={{
                          width: 1,
                          height: 20,
                          backgroundColor: '#E3E3E3',
                          marginHorizontal: 7
                        }}
                      />
                      <Image
                        source={require('../../src/assets/img/ic_comment.png')}
                        style={{
                          width: 17,
                          height: 17,
                          marginTop: 2,
                          marginRight: 5
                        }}
                        resizeMode='contain'
                      />
                      <Text style={{ fontSize: 16, color: '#888' }}>
                        {review.wo_count}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={{ fontSize: 15, color: '#888', lineHeight: 20 }}>
                  {review.tk_content}
                </Text>
              </TouchableOpacity>
            </View>
            {review.files ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {review.files.map((file, idx) => (
                  <Image
                    key={idx}
                    source={{
                      uri: `${BASE_URL}/${file.ft_file_path}`
                    }}
                    resizeMode='cover'
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginRight: idx[0] ? 5 : 10,
                      marginLeft: idx ? 0 : 10,
                      marginTop: 20
                    }}
                  />
                ))}
              </ScrollView>
            ) : null}
            <View
              style={{
                width: window,
                height: 1,
                backgroundColor: '#eaeaea',
                marginVertical: 20
              }}
            />
          </View>
        ))}
      </Content>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  thumbnailStyle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#ccc'
  }
})

export default Reviews
