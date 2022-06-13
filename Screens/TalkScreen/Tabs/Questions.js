import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {Content, Thumbnail} from 'native-base';
import axios from 'axios';
import qs from 'qs';

const baseUrl = 'https://dmonster1826.cafe24.com';

const Questions = (props) => {
  const navigation = props.navigation;
  const [questions, setQuestions] = useState([]);

  const today = new Date();
  const talkUpdatedDay = (day) => {
    return new Date(day);
  };

  useEffect(() => {
    axios({
      method: 'post',
      url: `${baseUrl}/api/talk/get_talks`,
      data: qs.stringify({
        tk_division: 'question',
      }),
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        if (res.data.result == 'success') {
          setQuestions(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <ScrollView>
      <Content style={{marginTop: 30}}>
        {/* Review 탭(이벤트참여) 1번째 리스트 */}
        {questions.map((question) => (
          <View key={question.tk_id}>
            <View style={{marginHorizontal: 20}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TalkDetail', {
                    title: question.tk_division,
                    ut_nickname: question.ut_nickname,
                    ut_image: question.ut_image,
                    tk_id: question.tk_id,
                    tk_content: question.tk_content,
                    files: question.files,
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}>
                  {!question.ut_image ? (
                    <Thumbnail
                      source={{
                        uri: 'https://aeealberta.org/wp-content/uploads/2018/10/profile.png',
                      }}
                      style={styles.thumbnailStyle}
                      resizeMode="cover"
                    />
                  ) : (
                    <Thumbnail
                      source={{
                        uri: `${baseUrl}/${question.ut_image}`,
                      }}
                      style={styles.thumbnailStyle}
                      resizeMode="cover"
                    />
                  )}
                  <View>
                    <View style={{flexDirection: 'row', marginBottom: 5}}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#4A26F4',
                          marginRight: 5,
                        }}>
                        질문있어요
                      </Text>
                      <Text style={{fontSize: 16, color: '#000'}}>
                        {question.ut_nickname}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{fontSize: 16, color: '#888'}}>
                        {Math.floor(
                          (today.getTime() -
                            talkUpdatedDay(question.ar_updated_at).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                        일전
                      </Text>
                      <View
                        style={{
                          width: 1,
                          height: 20,
                          backgroundColor: '#E3E3E3',
                          marginHorizontal: 7,
                        }}
                      />
                      <Image
                        source={require('../../src/assets/img/ic_comment.png')}
                        style={{
                          width: 17,
                          height: 17,
                          marginTop: 2,
                          marginRight: 5,
                        }}
                        resizeMode="contain"
                      />
                      <Text style={{fontSize: 16, color: '#888'}}>
                        {question.wo_count}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={{fontSize: 15, color: '#888', lineHeight: 20}}>
                  {question.tk_content}
                </Text>
              </TouchableOpacity>
            </View>
            {question.files ? (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {question.files.map((file, idx) => (
                  <Image
                    key={idx}
                    source={{
                      uri: `${baseUrl}/${file.ft_file_path}`,
                    }}
                    resizeMode="cover"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginRight: idx[0] ? 5 : 10,
                      marginLeft: idx ? 0 : 10,
                      marginTop: 20,
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
                marginVertical: 20,
              }}
            />
          </View>
        ))}
      </Content>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  thumbnailStyle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Questions;
