import React, { useEffect, useState, useMemo } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { Content, Thumbnail } from 'native-base'
import moment from 'moment'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import ImageModal from 'react-native-image-modal'
import qs from 'qs'
import axios from 'axios'

const baseUrl = 'https://dmonster1826.cafe24.com'

const index = (props) => {
  const { replyLists, ReplyDel } = props
  console.log('Reply index Props : ', replyLists)

  const userId = useSelector((state) => state.UserInfoReducer.ut_id)
  const [isImageModal, setImageModal] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [img, setImg] = useState('')
  const toggleModal = () => setModalVisible(!isModalVisible)

  const ImageView = (imgUrl) => {
    console.log('reply imgUrl : ', imgUrl)
    setImg(imgUrl)
    toggleModal()
  };

  return (
    <Content style={{ position: 'relative' }}>
      <Modal
        isVisible={isModalVisible}
        animationIn='fadeIn'
        backdropOpacity={0.8}
        onBackdropPress={toggleModal}
      >
        <TouchableOpacity
          onPress={toggleModal}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 5,
            elevation: 5
          }}
        >
          <Image
            source={require('../src/assets/img/_ic_del_small.png')}
            style={{
              width: 25,
              height: 25
            }}
            resizeMode='contain'
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'center'
          }}
        >
          {/* 모달 전체 레이아웃 */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15
            }}
          >
            <Image
              source={{ uri: `${baseUrl}${img}` }}
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').width
              }}
              resizeMode='contain'
            />
          </View>
          {/* //모달 전체 레이아웃 */}
        </View>
      </Modal>

      {replyLists !== null
        ? replyLists.map((w, idx) => (
          <View
              key={`${w.wo_id}${idx}`}
              style={{
                justifyContent: 'flex-start',
                backgroundColor: '#fff'
              }}
            >
              <View style={{ paddingHorizontal: 25, paddingVertical: 20 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 15
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center'
                    }}
                  >
                    <Thumbnail
                      source={
                        w.ut_image
                          ? { uri: `${baseUrl}${w.ut_image}` }
                          : require('../src/assets/img/pr_no_img.png')
                      }
                      style={{
                        width: 22,
                        height: 22,
                        borderWidth: 1,
                        borderColor: '#eee'
                      }}
                      resizeMode='cover'
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginLeft: 5,
                        color: '#888'
                      }}
                    >
                      {w.ut_nickname}
                    </Text>
                    {/* <View
                      style={{
                        height: 24,
                        width: 1,
                        backgroundColor: '#EAEAEA',
                        marginHorizontal: 7,
                        alignSelf: 'center',
                      }}></View> */}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ color: '#888888', fontSize: 14 }}>
                      {moment(w.wo_created_at).format('YYYY.MM.DD')}
                    </Text>
                    {w.wo_user_id === userId ? (
                      <TouchableOpacity
                        style={{ alignSelf: 'flex-end' }}
                        onPress={() => ReplyDel(w.wo_id)}
                      >
                        {console.log(w.wo_id)}
                        <Image
                          source={require('../src/assets/img/ic_del.png')}
                          style={{ width: 23, height: 23, marginLeft: 10 }}
                          resizeMode='contain'
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    lineHeight: 22,
                    color: '#020202'
                  }}
                >
                  {w.wo_word}
                </Text>
              </View>

              {!w.files ? null : w.files.length > 1 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {w.files.map((f, idx) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => ImageView(`${f.ft_file_path}`)}
                    >
                      <Image
                        key={f.ft_id}
                        source={{ uri: `${baseUrl}${f.ft_file_path}` }}
                        resizeMode='cover'
                        style={{
                          width: 300,
                          height: 160,
                          borderRadius: 15,
                          marginBottom: 20,
                          marginLeft: idx == 0 ? 25 : 5,
                          marginRight: idx == idx.length - 1 ? 25 : 5
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : w.files.length == 1 ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => ImageView(`${w.files[0].ft_file_path}`)}
                >
                  <Image
                    source={{ uri: `${baseUrl}${w.files[0].ft_file_path}` }}
                    resizeMode='cover'
                    style={{
                      width: 300,
                      height: 160,
                      borderRadius: 15,
                      marginBottom: 20,
                      marginLeft: 25,
                      marginRight: 5
                    }}
                  />
                </TouchableOpacity>
              ) : null}

              <View
                style={{
                  borderBottomColor: '#CCCCCC',
                  borderBottomWidth: 1
                }}
              />
            </View>
          ))
        : null}
    </Content>
  )
};

export default index
