import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Container,
  Content,
  Input,
  Textarea,
  Form,
  Item,
  Button,
} from 'native-base';

import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import qs from 'qs';
import axios from 'axios';
import Header from '../Common/Header';

const baseUrl = 'https://dmonster1826.cafe24.com';

const Edit = (props) => {
  const {
    title,
    content,
    tk_id,
    tk_division,
    tagTravel,
    tagRestaurant,
    tagCafe,
    tagShop,
  } = props.route.params;

  const navigation = props.navigation;
  console.log('Edit Files : ', files);
  console.log('Edit props : ', props);

  // Redux 연동
  const token = useSelector((state) => state.Reducer.token);

  const [checked, setChecked] = useState(tk_division);
  const [checkedDivision, setCheckedDivision] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isImagePickerModalVisible, setImagePickerModalVisible] =
    useState(false);
  const [isTagTravel, setTagTravel] = useState(false);
  const [isTagRestaurant, setTagRestaurant] = useState(false);
  const [isTagCafe, setTagCafe] = useState(false);
  const [isTagShop, setTagShop] = useState(false);
  const [talkContent, setTalkContent] = useState(null);
  const [talkUploadImage, setTalkUploadImage] = useState([]);
  const [sendSeverImage, setSendServerImage] = useState([]);

  console.log('checked : ', checked);

  const toggleModal = () => setModalVisible(!isModalVisible);
  const setCheckedLocal = (v) => {
    setChecked(v);
    // ReactNativeWebView.sendMessage(JSON.stringify(checked));
    toggleModal();
  };

  const [files, setFiles] = useState([]);
  const getTalk = () => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/talk/get_talk/${tk_id}`,
      headers: {
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        console.log('[EDIT PAGE] get Talk : ', res);
        if (res.data.result === 'success') {
          setFiles(res.data.data.files);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setTalkContent(content);
    if (tagTravel === '1') {
      setTagTravel(true);
    }
    if (tagRestaurant === '1') {
      setTagRestaurant(true);
    }
    if (tagCafe === '1') {
      setTagCafe(true);
    }
    if (tagShop === '1') {
      setTagShop(true);
    }
    getTalk();
    return () => {
      setTalkContent();
    };
  }, [content]);

  let ImageLength = talkUploadImage.length + files.length;
  const checkPhotos = () => {
    if (ImageLength >= 5) {
      Alert.alert(
        '사진은 5장까지 등록 가능합니다.',
        '사진 갯수를 확인해주세요.',
        [
          {
            text: '확인',
            onPress: () => {},
          },
        ],
      );
    }
    if (ImageLength < 5) {
      setImagePickerModalVisible(true);
    }
  };

  const photoCountErr = () => {
    Alert.alert(
      '사진은 5장까지 등록 가능합니다.',
      '사진 갯수를 확인해주세요.',
      [
        {
          text: '확인',
          onPress: () => {},
        },
      ],
    );
  };

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
      cropping: true,
    })
      .then((images) => {
        if (images.length + files.length > 5) {
          photoCountErr();
        } else if (images.length + talkUploadImage.length + files.length > 5) {
          photoCountErr();
        } else {
          // 현재 상태에 기기에서 불러온 이미지 값 저장 => 서버 업로드 전 기기에서 표시할 값
          setTalkUploadImage((prev) =>
            prev.concat(
              images.map((i) => {
                return {
                  uri: i.path,
                  data: i.data,
                  path: i.path,
                  width: i.width,
                  height: i.height,
                  mime: i.mime,
                };
              }),
            ),
          );
          // 서버에 보낼 이미지 저장 -> image64 파일만 뽑아 배열 형태로 저장
          setSendServerImage((prev) =>
            prev.concat(
              images.map((s_img) => {
                return s_img.data;
              }),
            ),
          );
          setImagePickerModalVisible(false);
        }
      })

      .catch((e) => console.log(e.message ? e.message : e));
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((images) => {
        setTalkUploadImage(
          images.map((i) => {
            console.log('received image', i);
            return {
              uri: i.path,
              data: i.data,
              path: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime,
            };
          }),
        );
        setImagePickerModalVisible(false);
      })
      .catch((e) => console.log(e.message ? e.message : e));
  };

  const modifyTalk = async () => {
    if (!talkContent) {
      Alert.alert(
        '내용을 입력해주세요.',
        '글을 작성해주셔야 등록 가능합니다.',
        [
          {
            text: '확인',
            onPress: () => {},
          },
        ],
      );
    } else {
      const sendData = {
        tk_id,
        tk_division: checked,
        tk_content: talkContent,
        tag_travel: isTagTravel ? 1 : 0,
        tag_restaurant: isTagRestaurant ? 1 : 0,
        tag_cafe: isTagCafe ? 1 : 0,
        tag_shop: isTagShop ? 1 : 0,
      };

      const options = {
        url: `${baseUrl}/api/talk/modify_talk`,
        method: 'post',
        headers: {
          authorization: token,
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
        data: qs.stringify(sendData),
      };

      await axios(options)
        .then((res) => {
          if (res.data.result === 'success') {
            Alert.alert('수정되었습니다.', '리스트로 이동합니다.', [
              {
                text: '확인',
                onPress: () => navigation.navigate('talk'),
              },
            ]);
          }
        })
        .catch((err) => console.log(err.message));

      await axios({
        method: 'post',
        url: `${baseUrl}/api/talk/add_talk_images`,
        headers: {
          authorization: token,
          'api-secret':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
        },
        data: qs.stringify({
          tk_id,
          images: sendSeverImage,
        }),
      })
        .then((res) => {
          if (res.data.result === 'success') {
            console.log('Image Upload Success!');
          }
        })
        .catch((err) => console.log(err.message));
    }
  };

  const onEventCheck = () => {
    setChecked('event');
    setModalVisible(!isModalVisible);
  };

  const onQuestionCheck = () => {
    setChecked('question');
    setModalVisible(!isModalVisible);
  };

  const onReviewCheck = () => {
    setChecked('review');
    setModalVisible(!isModalVisible);
  };

  const DelTalkServerImage = (ft_id) => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/talk/remove_talk_image/${ft_id}`,
      headers: {
        authorization: token,
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        if (res.data.result === 'success') {
          getTalk();
        }
      })
      .catch((err) => console.log(err));
  };

  const removeTalkImage = (ft_id) => {
    Alert.alert(
      '선택하신 이미지를 삭제하시겠습니까?',
      '삭제된 이미지는 복구되지 않습니다.',
      [
        {
          text: '확인',
          onPress: () => DelTalkServerImage(ft_id),
        },
        {
          text: '취소',
          onPress: () => {},
        },
      ],
    );
  };

  return (
    <Container
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <Header navigation={navigation} title={title} />
      <ScrollView>
        {/* 모달 설정 */}
        <Modal
          isVisible={isModalVisible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropOpacity={0.5}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            {/* 모달 전체 레이아웃 */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
              }}>
              {/* 지도 장소 셀렉트 */}
              <View>
                <View style={{marginVertical: 15}}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={onEventCheck}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                    }}>
                    <Text style={{fontSize: 18}}>이벤트참여</Text>
                    <Image
                      source={
                        checked === 'event'
                          ? require('../src/assets/img/radio_on.png')
                          : require('../src/assets/img/radio_off.png')
                      }
                      style={{width: 30, height: 30}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E3E3E3',
                  }}
                />
                <View style={{marginVertical: 15}}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={onQuestionCheck}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                    }}>
                    <Text style={{fontSize: 18}}>질문있어요</Text>
                    <Image
                      source={
                        checked === 'question'
                          ? require('../src/assets/img/radio_on.png')
                          : require('../src/assets/img/radio_off.png')
                      }
                      style={{width: 30, height: 30}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E3E3E3',
                  }}
                />
                <View style={{marginVertical: 15}}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={onReviewCheck}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                    }}>
                    <Text style={{fontSize: 18}}>여행후기</Text>
                    <Image
                      source={
                        checked === 'review'
                          ? require('../src/assets/img/radio_on.png')
                          : require('../src/assets/img/radio_off.png')
                      }
                      style={{width: 30, height: 30}}
                      resizeMode="contain"
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
          animationIn="fadeIn"
          backdropOpacity={0.5}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            {/* 모달 전체 레이아웃 */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
              }}>
              {/* 지도 장소 셀렉트 */}
              <View
                style={{
                  paddingVertical: 30,
                  paddingHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
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
                    borderRadius: 25,
                  }}>
                  <Text style={{color: '#fff'}}>휴대전화기에서 사진 선택</Text>
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
                    setImagePickerModalVisible(false);
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
                    borderRadius: 25,
                  }}>
                  <Text style={{color: '#4A26F4'}}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* //모달 전체 레이아웃 */}
          </View>
        </Modal>

        <Content>
          <View style={{marginTop: 30}} />

          {/* 선택(셀렉터) selector */}
          <View style={{paddingHorizontal: 15, marginBottom: 30}}>
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
                alignItems: 'center',
              }}>
              <Text>
                {checked === 'question'
                  ? '질문있어요'
                  : checked === 'event'
                  ? '이벤트참여'
                  : checked === 'review'
                  ? '여행후기'
                  : null}
              </Text>
              <Image
                source={require('../src/assets/img/ic_select.png')}
                resizeMode="contain"
                style={{width: 15, height: 15}}
              />
            </TouchableOpacity>
          </View>

          {/* 분류(중복선택가능) */}
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontSize: 18, marginBottom: 5}}>
              분류(중복선택가능)
            </Text>
            <View
              style={{flexDirection: 'row', marginTop: 15, marginBottom: 30}}>
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
                  marginRight: 5,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: isTagTravel ? '#fff' : '#E3E3E3',
                  }}>
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
                  marginRight: 5,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: isTagRestaurant ? '#fff' : '#E3E3E3',
                  }}>
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
                  marginRight: 5,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: isTagCafe ? '#fff' : '#E3E3E3',
                  }}>
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
                  marginRight: 5,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: isTagShop ? '#fff' : '#E3E3E3',
                  }}>
                  {isTagShop ? '쇼핑 x' : '쇼핑'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 사진 업로드 */}
          <View style={{paddingHorizontal: 20, paddingBottom: 10}}>
            <Text style={{fontSize: 18, marginBottom: 5}}>사진업로드</Text>
            <Text style={{fontSize: 14, marginBottom: 5, color: '#666666'}}>
              사진은 5장까지 업로드하실 수 있습니다.
            </Text>
            <View
              style={{
                marginTop: 10,
                marginBottom: 30,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {talkUploadImage.length !== 0 ? (
                talkUploadImage.length === 1 ? (
                  <TouchableOpacity
                    onPress={() => {
                      const removeImg = talkUploadImage.filter(
                        (selectImg) =>
                          selectImg.data !== talkUploadImage[0].data,
                      );
                      setTalkUploadImage(removeImg);
                    }}>
                    <ImageBackground
                      source={{uri: `${talkUploadImage[0].path}`}}
                      resizeMode="cover"
                      style={{
                        position: 'relative',
                        width: Dimensions.get('window').width * 0.27,
                        height: Dimensions.get('window').width * 0.27,
                        marginRight: Dimensions.get('window').width * 0.03,
                        marginBottom: Dimensions.get('window').width * 0.03,
                      }}
                      imageStyle={{borderRadius: 10}}>
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
                          alignItems: 'center',
                        }}>
                        <Image
                          source={require('../src/assets/img/_ic_del_small.png')}
                          style={{width: 15, height: 15}}
                          resizeMode="center"
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
                          (selectImg) => selectImg.data !== tkImg.data,
                        );
                        setTalkUploadImage(removeImg);
                      }}>
                      <ImageBackground
                        source={{uri: `${tkImg.path}`}}
                        resizeMode="cover"
                        style={{
                          position: 'relative',
                          width: Dimensions.get('window').width * 0.27,
                          height: Dimensions.get('window').width * 0.27,
                          marginRight: Dimensions.get('window').width * 0.03,
                          marginBottom: Dimensions.get('window').width * 0.03,
                        }}
                        imageStyle={{borderRadius: 10}}>
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
                            alignItems: 'center',
                          }}>
                          <Image
                            source={require('../src/assets/img/_ic_del_small.png')}
                            style={{width: 15, height: 15}}
                            resizeMode="center"
                          />
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  ))
                ) : null
              ) : null}

              {/* 기존 업로드 된 사진 */}
              {files.length !== 0 ? (
                files.length === 1 ? (
                  <TouchableOpacity
                    onPress={() => {
                      removeTalkImage(files[0].ft_id);
                    }}>
                    <ImageBackground
                      source={{uri: `${files[0].ft_download_url}`}}
                      resizeMode="cover"
                      style={{
                        position: 'relative',
                        width: Dimensions.get('window').width * 0.27,
                        height: Dimensions.get('window').width * 0.27,
                        marginRight: Dimensions.get('window').width * 0.03,
                        marginBottom: Dimensions.get('window').width * 0.03,
                      }}
                      imageStyle={{borderRadius: 10}}>
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
                          alignItems: 'center',
                        }}>
                        <Image
                          source={require('../src/assets/img/_ic_del_small.png')}
                          style={{width: 15, height: 15}}
                          resizeMode="center"
                        />
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                ) : files.length > 1 ? (
                  files.map((tkImg) => (
                    <TouchableOpacity
                      key={tkImg.ft_id}
                      onPress={() => {
                        removeTalkImage(tkImg.ft_id);
                      }}>
                      <ImageBackground
                        source={{uri: `${tkImg.ft_download_url}`}}
                        resizeMode="cover"
                        style={{
                          position: 'relative',
                          width: Dimensions.get('window').width * 0.27,
                          height: Dimensions.get('window').width * 0.27,
                          marginRight: Dimensions.get('window').width * 0.03,
                          marginBottom: Dimensions.get('window').width * 0.03,
                        }}
                        imageStyle={{borderRadius: 10}}>
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
                            alignItems: 'center',
                          }}>
                          <Image
                            source={require('../src/assets/img/_ic_del_small.png')}
                            style={{width: 15, height: 15}}
                            resizeMode="center"
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
                  borderRadius: 15,
                }}
                onPress={checkPhotos}>
                <Image
                  source={require('../src/assets/img/ic_photo.png')}
                  resizeMode="contain"
                  style={{
                    width: 70,
                    height: 70,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View>
              <Form>
                <Textarea
                  rowSpan={7}
                  placeholder="텍스트를 입력해주세요"
                  placeholderTextColor="#E3E3E3"
                  value={talkContent}
                  style={{
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: '#eee',
                    borderRadius: 10,
                    paddingLeft: 15,
                    marginBottom: 20,
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
              justifyContent: 'center',
            }}>
            <TouchableOpacity activeOpacity={0.7} onPress={modifyTalk}>
              <Text
                style={{
                  backgroundColor: '#4A26F4',
                  paddingHorizontal: 70,
                  paddingVertical: 15,
                  borderRadius: 30,
                  fontSize: 18,
                  color: '#fff',
                }}>
                수정하기
              </Text>
            </TouchableOpacity>
          </View>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default Edit;
