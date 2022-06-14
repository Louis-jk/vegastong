import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
  Dimensions
} from 'react-native'
import {
  Container,
  Content,
  Input,
  Textarea,
  Form,
  Item,
  Button
} from 'native-base'

import Modal from 'react-native-modal'
import ImagePicker from 'react-native-image-crop-picker'
import { useSelector } from 'react-redux'
import qs from 'qs'
import Header from '../Common/Header'
import { VegasPost } from '../../utils/axios.config'

const Faq = (props) => {
  const title = props.route.params.title
  const navigation = props.navigation

  // Redux 연동
  const token = useSelector((state) => state.Reducer.token)

  const [checked, setChecked] = useState('question')
  const [checkedDivision, setCheckedDivision] = useState(null)
  const [isModalVisible, setModalVisible] = useState(false)
  const [isImagePickerModalVisible, setImagePickerModalVisible] =
    useState(false)
  const [isTagTravel, setTagTravel] = useState(false)
  const [isTagRestaurant, setTagRestaurant] = useState(false)
  const [isTagCafe, setTagCafe] = useState(false)
  const [isTagShop, setTagShop] = useState(false)
  const [talkContent, setTalkContent] = useState(null)
  const [talkUploadImage, setTalkUploadImage] = useState([])
  const [sendServerImage, setSendServerImage] = useState([])

  const toggleModal = () => setModalVisible(!isModalVisible)
  const setCheckedLocal = (v) => {
    setChecked(v)
    // ReactNativeWebView.sendMessage(JSON.stringify(checked));
    toggleModal()
  };

  const checkPhotos = () => {
    if (talkUploadImage.length >= 5) {
      Alert.alert(
        '사진은 5장까지 등록 가능합니다.',
        '사진 갯수를 확인해주세요.',
        [
          {
            text: '확인',
            onPress: () => {}
          }
        ]
      )
    }
    console.log('talkUploadImage ::::::::::', talkUploadImage)
    if (talkUploadImage.length < 5) {
      setImagePickerModalVisible(true)
    }
  }

  const photoCountErr = () => {
    Alert.alert(
      '사진은 5장까지 등록 가능합니다.',
      '사진 갯수를 확인해주세요.',
      [
        {
          text: '확인',
          onPress: () => {}
        }
      ]
    )
  };

  const [talkPhoto, setTalkPhoto] = useState([])

  const importPhoto = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      sortOrder: 'desc',
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      useFrontCamera: false,
      includeBase64: true,
      cropping: true
    })
      .then((images) => {
        if (images.length > 5) {
          photoCountErr()
        } else if (images.length + talkUploadImage.length > 5) {
          photoCountErr()
        } else {
          setTalkUploadImage((prev) =>
            prev.concat(
              images.map((i) => {
                // console.log('received image', i);
                return {
                  uri: i.path,
                  data: i.data,
                  path: i.path,
                  width: i.width,
                  height: i.height,
                  mime: i.mime
                }
              })
            )
          )
          // setSendServerImage(talkUploadImage.map((tkImage) => tkImage.data));
          setSendServerImage((prev) =>
            prev.concat(
              images.map((s_img) => {
                return s_img.data
              })
            )
          )
          setImagePickerModalVisible(false)
        }
      })

    // .then((data) => console.log('data : ', data))

      .catch((e) => console.log(e.message ? e.message : e))
  };

  console.log('talkUpload : ', talkUploadImage)
  console.log('sendServerImage : ', sendServerImage)

  const addTalk = () => {
    if (!talkContent) {
      Alert.alert(
        '내용을 입력해주세요.',
        '글을 작성해주셔야 등록 가능합니다.',
        [
          {
            text: '확인',
            onPress: () => {}
          }
        ]
      )
    } else {
      const sendData = {
        tk_division: checked,
        tk_content: talkContent,
        tag_travel: isTagTravel ? 1 : 0,
        tag_restaurant: isTagRestaurant ? 1 : 0,
        tag_cafe: isTagCafe ? 1 : 0,
        tag_shop: isTagShop ? 1 : 0,
        images: sendServerImage
      }

      VegasPost('/api/talk/add_talk', qs.stringify(sendData), {
        headers: { authorization: `${token}` }
      })
        .then((res) => {
          if (res.result === 'success') {
            Alert.alert(
              '작성하신 글이 등록되었습니다.',
              '리스트로 이동합니다.',
              [
                {
                  text: '확인',
                  onPress: () => navigation.navigate('talk')
                }
              ]
            )
          }
        })
        .catch((err) => console.log(err.message))
    }
  }

  const onEventCheck = () => {
    setChecked('event')
    setModalVisible(!isModalVisible)
  };

  const onQuestionCheck = () => {
    setChecked('question')
    setModalVisible(!isModalVisible)
  };

  const onReviewCheck = () => {
    setChecked('review')
    setModalVisible(!isModalVisible)
  };

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
        {/* 모달 설정 */}
        <Modal
          isVisible={isModalVisible}
          animationIn='fadeIn'
          animationOut='fadeOut'
          backdropOpacity={0.5}
          onBackdropPress={toggleModal}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {/* 모달 전체 레이아웃 */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10
              }}
            >
              {/* 지도 장소 셀렉트 */}
              <View>
                <View style={{ marginVertical: 15 }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={onEventCheck}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>자유게시판</Text>
                    <Image
                      source={
                        checked === 'event'
                          ? require('../src/assets/img/radio_on.png')
                          : require('../src/assets/img/radio_off.png')
                      }
                      style={{ width: 30, height: 30 }}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E3E3E3'
                  }}
                />
                <View style={{ marginVertical: 15 }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={onQuestionCheck}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>질문있어요</Text>
                    <Image
                      source={
                        checked === 'question'
                          ? require('../src/assets/img/radio_on.png')
                          : require('../src/assets/img/radio_off.png')
                      }
                      style={{ width: 30, height: 30 }}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E3E3E3'
                  }}
                />
                <View style={{ marginVertical: 15 }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={onReviewCheck}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>여행후기</Text>
                    <Image
                      source={
                        checked === 'review'
                          ? require('../src/assets/img/radio_on.png')
                          : require('../src/assets/img/radio_off.png')
                      }
                      style={{ width: 30, height: 30 }}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* //모달 전체 레이아웃 */}
          </View>
        </Modal>

        {/* 사진업로드 모달 */}
        <Modal
          isVisible={isImagePickerModalVisible}
          animationIn='fadeIn'
          backdropOpacity={0.5}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {/* 모달 전체 레이아웃 */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10
              }}
            >
              {/* 지도 장소 셀렉트 */}
              <View
                style={{
                  paddingVertical: 30,
                  paddingHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TouchableOpacity
                  onPress={importPhoto}
                  style={{
                    alignSelf: 'center',
                    marginVertical: 10,
                    paddingVertical: 15,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#4A26F4',
                    borderRadius: 25
                  }}
                >
                  <Text style={{ color: '#fff' }}>휴대전화기에서 사진 선택</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={takePhoto}
                  style={{
                    alignSelf: 'center',
                    marginVertical: 10,
                    paddingVertical: 15,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#4A26F4',
                    borderRadius: 25,
                  }}>
                  <Text style={{color: '#fff'}}>카메라로 사진 찍기</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    setImagePickerModalVisible(false)
                  }}
                  style={{
                    alignSelf: 'center',
                    marginVertical: 10,
                    paddingVertical: 15,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#4A26F4',
                    backgroundColor: '#fff',
                    borderRadius: 25
                  }}
                >
                  <Text style={{ color: '#4A26F4' }}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* //모달 전체 레이아웃 */}
          </View>
        </Modal>

        <Content>
          <View style={{ marginTop: 30 }} />

          {/* 선택(셀렉터) selector */}
          <View style={{ paddingHorizontal: 15, marginBottom: 30 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleModal}
              style={{
                backgroundColor: '#F8F8F8',
                borderRadius: 10,
                paddingHorizontal: 15,
                width: '100%',
                height: 50,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Text>
                {checked === 'question'
                  ? '질문있어요'
                  : checked === 'event'
                    ? '자유게시판'
                    : checked === 'review'
                      ? '여행후기'
                      : null}
              </Text>
              <Image
                source={require('../src/assets/img/ic_select.png')}
                resizeMode='contain'
                style={{ width: 15, height: 15 }}
              />
            </TouchableOpacity>
          </View>

          {/* 분류(중복선택가능) */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              분류(중복선택가능)
            </Text>
            <View
              style={{ flexDirection: 'row', marginTop: 15, marginBottom: 30 }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setTagTravel(!isTagTravel)}
                activeOpacity={0.8}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: isTagTravel ? '#4A26F4' : 'transparent',
                  borderRadius: 25,
                  borderColor: isTagTravel ? '#4A26F4' : '#E3E3E3',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  marginRight: 5
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: isTagTravel ? '#fff' : '#E3E3E3'
                  }}
                >
                  {isTagTravel ? '여행 x' : '여행'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setTagRestaurant(!isTagRestaurant)}
                activeOpacity={0.8}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: isTagRestaurant ? '#4A26F4' : 'transparent',
                  borderRadius: 25,
                  borderColor: isTagRestaurant ? '#4A26F4' : '#E3E3E3',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  marginRight: 5
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: isTagRestaurant ? '#fff' : '#E3E3E3'
                  }}
                >
                  {isTagRestaurant ? '맛집 x' : '맛집'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setTagCafe(!isTagCafe)}
                activeOpacity={0.8}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: isTagCafe ? '#4A26F4' : 'transparent',
                  borderRadius: 25,
                  borderColor: isTagCafe ? '#4A26F4' : '#E3E3E3',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  marginRight: 5
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: isTagCafe ? '#fff' : '#E3E3E3'
                  }}
                >
                  {isTagCafe ? '카페 x' : '카페'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setTagShop(!isTagShop)}
                activeOpacity={0.8}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: isTagShop ? '#666666' : 'transparent',
                  borderRadius: 25,
                  borderColor: isTagShop ? '#666666' : '#E3E3E3',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  marginRight: 5
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: isTagShop ? '#fff' : '#E3E3E3'
                  }}
                >
                  {isTagShop ? '쇼핑 x' : '쇼핑'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 사진 업로드 */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>사진업로드</Text>
            <Text style={{ fontSize: 14, marginBottom: 5, color: '#666666' }}>
              사진은 5장까지 업로드하실 수 있습니다.
            </Text>
            <View
              style={{
                marginTop: 10,
                marginBottom: 30,
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {talkUploadImage.length !== 0 ? (
                talkUploadImage.length === 1 ? (
                  <TouchableOpacity
                    onPress={() => {
                      const removeImg = talkUploadImage.filter(
                        (selectImg) =>
                          selectImg.data !== talkUploadImage[0].data
                      )
                      console.log('마지막 사진 : ', talkUploadImage)
                      setTalkUploadImage(removeImg)
                    }}
                  >
                    <ImageBackground
                      source={{ uri: `${talkUploadImage[0].path}` }}
                      resizeMode='cover'
                      style={{
                        position: 'relative',
                        width: Dimensions.get('window').width * 0.27,
                        height: Dimensions.get('window').width * 0.27,
                        marginRight: Dimensions.get('window').width * 0.03,
                        marginBottom: Dimensions.get('window').width * 0.03
                      }}
                      imageStyle={{ borderRadius: 10 }}
                    >
                      <View
                        style={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          width: 23,
                          height: 23,
                          borderRadius: 50,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Image
                          source={require('../src/assets/img/_ic_del_small.png')}
                          style={{ width: 15, height: 15 }}
                          resizeMode='center'
                        />
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                ) : talkUploadImage.length > 1 ? (
                  talkUploadImage.map((tkImg, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        const removeImg = talkUploadImage.filter(
                          (selectImg) => selectImg.data !== tkImg.data
                        )
                        setTalkUploadImage(removeImg)
                      }}
                    >
                      <ImageBackground
                        source={{ uri: `${tkImg.path}` }}
                        resizeMode='cover'
                        style={{
                          position: 'relative',
                          width: Dimensions.get('window').width * 0.27,
                          height: Dimensions.get('window').width * 0.27,
                          marginRight: Dimensions.get('window').width * 0.03,
                          marginBottom: Dimensions.get('window').width * 0.03
                        }}
                        imageStyle={{ borderRadius: 10 }}
                      >
                        <View
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            width: 23,
                            height: 23,
                            borderRadius: 50,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Image
                            source={require('../src/assets/img/_ic_del_small.png')}
                            style={{ width: 15, height: 15 }}
                            resizeMode='center'
                          />
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  ))
                ) : null
              ) : null}

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: Dimensions.get('window').width * 0.27,
                  height: Dimensions.get('window').width * 0.27,
                  borderWidth: 1,
                  borderColor: '#E3E3E3',
                  borderRadius: 15
                }}
                onPress={checkPhotos}
              >
                <Image
                  source={require('../src/assets/img/ic_photo.png')}
                  resizeMode='contain'
                  style={{
                    width: 70,
                    height: 70
                  }}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Form>
                <Textarea
                  rowSpan={7}
                  placeholder='텍스트를 입력해주세요'
                  placeholderTextColor='#E3E3E3'
                  value={talkContent}
                  style={{
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: '#eee',
                    borderRadius: 10,
                    paddingLeft: 15,
                    marginBottom: 20
                  }}
                  onChangeText={(text) => setTalkContent(text)}
                />
              </Form>
            </View>
          </View>

          {/* 글쓰기 버튼 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <TouchableOpacity activeOpacity={0.7} onPress={addTalk}>
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

export default Faq
