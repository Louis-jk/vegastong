import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  ImageBackground,
  Alert,
  ScrollView,
} from 'react-native';
import {Form, Textarea} from 'native-base';
import qs from 'qs';

import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import {VegasPost} from '../../utils/axios.config';

const ReplyForm = (props) => {
  const {token} = useSelector((state) => state.Reducer);
  const {wo_ref_id, wo_category, getApi, getReplyAPI} = props;
  const navigation = props.navigation;
  const [replyText, setReplyText] = useState('');

  const loginInfo = () => {
    Alert.alert('회원만 댓글을 쓰실 수 있습니다.', '로그인 하시겠습니까?', [
      {
        text: '확인',
        onPress: () => navigation.navigate('login'),
      },
      {
        text: '취소',
        onPress: () => {},
      },
    ]);
  };

  const checkPhotos = () => {
    if (talkUploadImage.length >= 5) {
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

    if (talkUploadImage.length < 5) {
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

  const [talkUploadImage, setTalkUploadImage] = useState([]);
  const [sendServerImage, setSendServerImage] = useState([]);
  const [isImagePickerModalVisible, setImagePickerModalVisible] =
    useState(false);
  // 사진 업로드
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
        if (images.length > 5) {
          photoCountErr();
        } else if (images.length + talkUploadImage.length > 5) {
          photoCountErr();
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
                  mime: i.mime,
                };
              }),
            ),
          );
          // setSendServerImage(talkUploadImage.map((tkImage) => tkImage.data));
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

      // .then((data) => console.log('data : ', data))

      .catch((e) => console.log(e.message ? e.message : e));
  };

  const onSubmit = () => {
    if (!replyText) {
      Alert.alert(
        '댓글을 입력하시고 등록해주세요.',
        '내용이 없으면 등록되지 않습니다.',
        [
          {
            text: '확인',
            onPress: () => {},
          },
        ],
      );
    } else {
      VegasPost(
        '/api/word/add_word',
        qs.stringify({
          wo_category,
          wo_ref_id,
          wo_word: replyText,
          images: sendServerImage,
        }),
        {headers: {authorization: `${token}`}},
      )
        .then(() => {
          Alert.alert(
            '고객님의 소중한 댓글이 등록되었습니다.',
            '확인하시겠습니까?',
            [
              {
                text: '확인',
                onPress: () => {},
              },
              {
                text: '홈으로 이동',
                onPress: () => navigation.navigate('home'),
              },
            ],
          );
          getApi();
          getReplyAPI();
          setReplyText('');
          setTalkUploadImage([]);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <View>
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

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#222222'}}>
          댓글달기
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          underlayColor="#F5BB00"
          style={{
            borderRadius: 40,
            paddingVertical: 10,
            paddingHorizontal: 25,
            backgroundColor: '#4A26F4',
          }}
          onPress={onSubmit}>
          <Text style={{color: '#fff'}}>등록</Text>
        </TouchableOpacity>
      </View>
      <Form>
        <Textarea
          rowSpan={4}
          bordered
          placeholder="텍스트를 입력해주세요"
          style={{
            position: 'relative',
            borderRadius: 10,
            borderColor: '#E3E3E3',
            padding: 10,
            backgroundColor: '#F8F8F8',
          }}
          placeholderTextColor="#AAAAAA"
          value={replyText}
          onChangeText={(text) => setReplyText(text)}
          multiline
          autoCapitalize="none"
        />
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={checkPhotos}
            activeOpacity={0.6}
            underlayColor="#eaeaea"
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // borderWidth: 1,
              // borderColor: '#EAEAEA',
              // borderRadius: 50,
              paddingHorizontal: 10,
            }}>
            {/* ic_photo.png */}
            <Image
              source={require('../src/assets/img/ic_photo.png')}
              resizeMode="cover"
              style={{width: 20, height: 20, marginRight: 5}}
            />
            <Text style={{fontSize: 12, color: '#666666', lineHeight: 20}}>
              사진선택
            </Text>
          </TouchableOpacity>
        </View>
      </Form>
      {/* 사진 업로드 */}
      <View>
        <Text style={{fontSize: 14, marginVertical: 5, color: '#AAAAAA'}}>
          사진은 5장까지 업로드하실 수 있습니다.
        </Text>
        <View
          style={{
            marginVertical: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {talkUploadImage.length !== 0 ? (
            talkUploadImage.length === 1 ? (
              <TouchableOpacity
                onPress={() => {
                  const removeImg = talkUploadImage.filter(
                    (selectImg) => selectImg.data !== talkUploadImage[0].data,
                  );
                  console.log('마지막 사진 : ', talkUploadImage);
                  setTalkUploadImage(removeImg);
                }}>
                <ImageBackground
                  source={{uri: `${talkUploadImage[0].path}`}}
                  resizeMode="cover"
                  style={{
                    position: 'relative',
                    width: Dimensions.get('window').width * 0.47,
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {talkUploadImage.map((tkImg, idx) => (
                  <TouchableOpacity
                    key={`reply-image-${idx}`}
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
                        width: Dimensions.get('window').width * 0.47,
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
                          style={{
                            width: 15,
                            height: 15,
                          }}
                          resizeMode="center"
                        />
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : null
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default ReplyForm;
