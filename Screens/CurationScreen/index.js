import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  FlatList
} from 'react-native'
import { Container, Content, Thumbnail } from 'native-base'
import qs from 'qs'
import axios from 'axios'
import BottomTabs from '../Common/BottomTabs'
import SearchBar from '../Common/SearchBar'

const { window } = Dimensions.get('window')

// const baseUrl = 'https://gongjuro.com'
const baseUrl = 'https://dmonster1826.cafe24.com'

const CurationScreen = ({ navigation, route }) => {
  const [lists, setLists] = useState([])
  console.log('curation list : ', lists)

  useEffect(() => {
    axios({
      method: 'post',
      url: `${baseUrl}/api/curation/get_curations`,
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U'
      },
      data: qs.stringify({
        page: 1
      })
    })
      .then((res) => res.data)
      .then((data) => setLists(data.data))
      .catch((e) => console.error(e))
  }, [])

  console.log('curation list : ', lists)

  const routeName = route.name
  console.log('curation lists : ', lists)
  return (
    <>
      <Container>
        <SearchBar navigation={navigation} />
        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#222222'
            }}
          >
            🇺🇸 새소식
          </Text>
        </View>
        <ScrollView style={{ backgroundColor: '#fff' }}>
          <Content style={{ marginBottom: 10, paddingHorizontal: 20 }}>
            {lists.map((list) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CurationDetail', {
                    title: '새소식', // list.cu_title
                    id: list.cu_id
                  })}
                key={list.cu_id}
                activeOpacity={0.8}
              >
                <View style={{ marginVertical: 10 }}>
                  <Image
                    source={{
                      uri: `${baseUrl}${list.files[0].ft_file_path}`
                    }}
                    resizeMode='cover'
                    style={styles.contentListImg}
                  />
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#eee',
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      padding: 15
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#222'
                      }}
                      numberOfLines={1}
                    >
                      {list.cu_title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Content>
        </ScrollView>
      </Container>
      <BottomTabs navigation={navigation} routeName={routeName} />
    </>
  )
};

const styles = StyleSheet.create({
  contentListImg: {
    width: window,
    height: Dimensions.get('window').width / 2.65,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  }
})

export default CurationScreen
