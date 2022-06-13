import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Button,
} from 'react-native';
import {Container, Content, Thumbnail, Textarea, Form} from 'native-base';
import Modal from 'react-native-modal';

import Reply from '../Reply';
import ScrapButton from '../Common/ScrapButton';
import ReplyCount from '../Common/ReplyCount';
import ReplyForm from '../Common/ReplyForm';

const {width} = Dimensions.get('window');

const index = ({navigation, route}) => {
  const [scrap, setScrap] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const curImg = route.params.props.image;
  const curTitle = route.params.props.title;
  const curAvatarProfile = route.params.props.avatar.profile;
  const curAvatarName = route.params.props.avatar.name;

  const toggleScrap = () => setScrap(!scrap);
  const toggleModal = () => setModalVisible(!isModalVisible);

  return (
    <Container>
      {/* 모달 설정 */}
      <Modal isVisible={isModalVisible} animationIn="fadeIn">
        <View style={{flex: 1}}>
          {/* 모달 전체 레이아웃 */}

          <View
            style={{
              backgroundColor: 'transparent',
              borderRadius: 15,
              marginHorizontal: 10,
              marginTop: 100,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../src/assets/img/event_top.png')}
                resizeMode="contain"
                style={{
                  width: 200,
                  height: 100,
                  backgroundColor: 'transparent',
                }}
              />
            </View>
            {/* 모달 타이틀 */}
            <View
              style={{
                backgroundColor: '#E8EBFF',
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                paddingVertical: 25,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 30,
                  color: 'rgba(199,87,15,1)',
                  letterSpacing: -2,
                  marginBottom: 2,
                }}>
                혜택 내용
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 22,
                  color: 'rgba(199,87,15,0.7)',
                }}>
                다양한 혜택을 누리세요
              </Text>
            </View>
            {/* //모달 타이틀 */}
            {/* 모달 내용 */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                paddingVertical: 20,
                paddingHorizontal: 20,
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  lineHeight: 22,
                  marginBottom: 20,
                }}>
                #지금공주는 #비오는공주 #공주가볼만한곳 #공주즐기기
              </Text>
              <Text style={{fontSize: 16, textAlign: 'center', lineHeight: 22}}>
                비내리는 소리와 함께 #공주한옥마을 에서 #금강온천수로
                #족욕체험을~
              </Text>
              <Text style={{fontSize: 16, textAlign: 'center', lineHeight: 22}}>
                비가 오니깐 실내관람여행지 #국립공주박물관
              </Text>
              {/* 모달 버튼 */}
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#F8F8F8',
                  marginVertical: 20,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(toggleModal);
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#666666',
                      borderStyle: 'solid',
                      borderRadius: 30,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        paddingHorizontal: 35,
                        paddingVertical: 15,

                        marginHorizontal: 10,
                      }}>
                      닫기
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(toggleModal);
                  }}
                  style={{
                    backgroundColor: '#4A26F4',
                    marginHorizontal: 10,
                    borderRadius: 30,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      paddingHorizontal: 60,
                      paddingVertical: 15,
                    }}>
                    확인
                  </Text>
                </TouchableOpacity>
              </View>
              {/* //모달 버튼 */}
            </View>
            {/* //모달 내용 */}
          </View>
          {/* //모달 전체 레이아웃 */}
        </View>
      </Modal>

      <ScrollView style={{backgroundColor: '#fff'}}>
        <View style={{position: 'relative'}}>
          <Image
            source={curImg}
            style={{
              width: width,
              height: 300,
              borderBottomLeftRadius: 35,
              borderBottomRightRadius: 35,
              marginBottom: 20,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)',
              paddingHorizontal: 10,
              width: '100%',
            }}>
            <View>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../src/assets/img/top_ic_history_w.png')}
                  resizeMode="contain"
                  style={{width: 25, height: 25, marginRight: 10}}
                />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 18,
                  }}>
                  베가스여행
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  source={require('../src/assets/img/top_ic_menu.png')}
                  resizeMode="contain"
                  style={{width: 60, height: 60}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Content style={{paddingHorizontal: 20}}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginBottom: 20,
            }}>
            {curTitle}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <Thumbnail
              source={curAvatarProfile}
              style={{width: 30, height: 30}}
              resizeMode="cover"
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              {curAvatarName}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: '#EFEFEF',
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text
              style={{
                backgroundColor: '#4A26F4',
                paddingVertical: 5,
                paddingHorizontal: 7,
                borderRadius: 10,
                color: '#fff',
                fontSize: 10,
                marginRight: 10,
              }}>
              도로명
            </Text>
            <Text style={{marginVertical: 20}}>공주시 금성동 53-51</Text>
          </View>
          <View
            style={{
              borderBottomColor: '#EFEFEF',
              borderBottomWidth: 1,
            }}
          />
          <View style={{marginVertical: 15}}>
            <View style={{marginVertical: 7}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#4A26F4',
                  marginBottom: 7,
                }}>
                운영시간
              </Text>
              <Text style={{fontSize: 16}}>
                평일 10:00 - 21:00, 공휴일 휴무
              </Text>
            </View>
            <View style={{marginVertical: 7}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#4A26F4',
                  marginBottom: 7,
                }}>
                메뉴 / 가격
              </Text>
              <Text style={{fontSize: 16, lineHeight: 23}}>
                공주국밥, 하얀국밥 8,000원, 알밤냉면, 알밤묵밥 7,000원,
                버섯불고기 14,000원 등
              </Text>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: '#EFEFEF',
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 30,
            }}>
            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../src/assets/img/cont_ic01.png')}
                resizeMode="contain"
                style={{width: 50, height: 50}}
              />
              <Text>네비게이션</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../src/assets/img/cont_ic02.png')}
                resizeMode="contain"
                style={{width: 50, height: 50}}
              />
              <Text>위치공유</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}
              onPress={toggleModal}>
              <Image
                source={require('../src/assets/img/cont_ic03.png')}
                resizeMode="contain"
                style={{width: 50, height: 50}}
              />
              <Text>혜택</Text>
            </TouchableOpacity>
          </View>
        </Content>
        <Content>
          <View style={{position: 'relative', width: width, marginBottom: 80}}>
            <ImageBackground
              style={{
                backgroundColor: '#E8EBFF',
                width: width,
                height: 150,
                borderBottomLeftRadius: 60,
                borderTopLeftRadius: 60,
              }}
            />
            <Image
              source={require('../src/assets/img/cont_img01.png')}
              style={{
                position: 'absolute',
                top: 20,
                left: -15,
                width: 200,
                height: 160,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                position: 'absolute',
                top: 30,
                right: 30,
                width: 270,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#4A26F4',
                textAlign: 'right',
                lineHeight: 26,
              }}>
              인생에 꼭한번 방문해보면 좋을 곳입니다. 큐레이터 강추 맛집이에요!
              3줄까지 나와도 좋을 듯
            </Text>
          </View>
        </Content>
        <Content style={{paddingHorizontal: 20, marginVertical: 40}}>
          <ScrapButton toggleScrap={toggleScrap} scrap={scrap} />
          <ReplyCount />
          <View
            style={{
              borderBottomColor: '#EFEFEF',
              borderBottomWidth: 1,
            }}
          />
          <View style={{marginTop: 30, marginBottom: 20}}>
            <Text style={{fontSize: 18, textAlign: 'center', color: '#A0A0A0'}}>
              이 글에 대한 평가를 해주세요
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Image
                source={require('../src/assets/img/star_off.png')}
                style={{width: 50, height: 50}}
                resizeMode="contain"
              />
              <Image
                source={require('../src/assets/img/star_off.png')}
                style={{width: 50, height: 50}}
                resizeMode="contain"
              />
              <Image
                source={require('../src/assets/img/star_off.png')}
                style={{width: 50, height: 50}}
                resizeMode="contain"
              />
              <Image
                source={require('../src/assets/img/star_off.png')}
                style={{width: 50, height: 50}}
                resizeMode="contain"
              />
              <Image
                source={require('../src/assets/img/star_off.png')}
                style={{width: 50, height: 50}}
                resizeMode="contain"
              />
            </View>
          </View>

          <ReplyForm />
        </Content>
        <Reply
          curImg={curImg}
          curTitle={curTitle}
          curAvatarProfile={curAvatarProfile}
          curAvatarName={curAvatarName}
        />
      </ScrollView>
    </Container>
  );
};

export default index;
