import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Container,
  Content,
  Button,
  Icon,
  Input,
  InputGroup,
  Header,
  Thumbnail,
} from 'native-base';

// import Swiper from 'react-native-swiper';
import BottomTabs from './Common/BottomTabs';
import SearchBar from './Common/SearchBar';

const {window} = Dimensions.get('window');

const adPostGallery = [
  {
    id: 1,
    image: {
      uri: 'https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sCmRaAAAAeehbjVF_9m2DKUt-JdTHh1eFEVvrGd0DW0JbVgEaQbqZEUNBt0hxGGZ4-nkIbtvMfBMSddlxTgGFUyrqQLQ4PR7E1iQDnEKaS2G6A63H5prdGifgFSsSBuA-EJvr7idFEhDVm7d52DC1Yh0uAvLejEa8GhTNBZxIR_md0BQRcWYInpPlnppItQ&4u16383&5m1&2e1&callback=none&client=google-maps-pro&token=6013',
    },
    title: '공주 한옥테마여행 다녀왔어요! 너무 재미있었어요!',
    avatar: {
      profile: {
        uri: 'https://post.healthline.com/wp-content/uploads/2020/09/2263-black_woman_laughing-1200x628-FACEBOOK-1200x628.jpg',
      },
      name: '비앙카',
    },
    tags: ['여행', '맛집'],
  },
  {
    id: 2,
    image: {
      uri: 'https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sCmRaAAAAR2dTBrt_gLIyGM2gLw_bpjQ3W1csZ6y5mLhR8WhL5CIIRY2dHpbaVFXX38UzT2eGJu0h6hajcxNDvQiyf-Vpo7swfkyTq_wjUCuSdzijWvo48D_2NMMBG1f0cEFFBjYWEhBN-F7IguK5x531B0lZUx6kGhQ6RsDQsTQohW_5jigDF-aClO03Vg&4u16383&5m1&2e1&callback=none&client=google-maps-pro&token=113425',
    },
    title: '한옥테마 여행 좋은거 같음',
    avatar: {
      profile: {
        uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
      },
      name: '제임스',
    },
    tags: ['여행', '쇼핑'],
  },
  {
    id: 3,
    image: {
      uri: 'https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sCmRZAAAAI1YjHczm3HpRinN5NQFiBHbKLBOSM5O_AI4tY8bJ0zSNIJBFvArW2avBTYY13IJ_XFklEmnH_kHFyuVOyFlQAxRlFxamr83aYR5BAmz_NoWssN1zjZmQAlYEsuZ8aWZfEhAdPw-0yZRHysDOmI_Fw7sHGhRYM4H4xEOCOrB433idC020yUD5Tg&4u16383&5m1&2e1&callback=none&client=google-maps-pro&token=84249',
    },
    title: '한옥스테이도 있으면 좋을꺼 같아요.',
    avatar: {
      profile: {
        uri: 'https://www.mountelizabeth.com.sg/images/default-source/default-album/young-woman-smile-tnb4acce7749bf63eeab9aff0b00dba087.jpg?sfvrsn=1d13ad1e_0',
      },
      name: '제시카',
    },
    tags: ['여행'],
  },
  {
    id: 4,
    image: {
      uri: 'https://images.unsplash.com/photo-1529883406927-e996c9ae3353?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    },
    title: '할머니집 한옥느낌',
    avatar: {
      profile: {
        uri: 'https://bostonglobe-prod.cdn.arcpublishing.com/resizer/95u6LP-Az4FiqEEoWCi2T1_mVwk=/1440x0/arc-anglerfish-arc2-prod-bostonglobe.s3.amazonaws.com/public/J2WKBDBAH4I6VD5FPDKWPPOHYQ.jpg',
      },
      name: '엠마',
    },
    tags: ['여행'],
  },
  {
    id: 5,
    image: {
      uri: 'https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sCmRaAAAA3-unTTC3pNmtukkRtYWx7kC_R6KXMMRPIk0WZ2K223v7cABt1DMvjkpcLWRm3cLNUkp88AYEO_yzhBDAlvJIsXVPN8_pH37VutddK75n4Bj_k0-YCEPuEy0a5-YbUFWtEhDbN75fwxfgQ3mVULOJSKnlGhRLCuwL-jTnyojTrCtxPhvgmjKxkw&4u16383&5m1&2e1&callback=none&client=google-maps-pro&token=50664',
    },
    title: '고오급진 한옥마을',
    avatar: {
      profile: {
        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQhBMyFnyzLxKvKaXdMCnbLhsnzOr3H8zIq-w&usqp=CAU',
      },
      name: '가브리엘',
    },
    tags: ['여행', '쇼핑'],
  },
  {
    id: 6,
    image: {
      uri: 'https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sCmRaAAAAI_YkmWB-z1Jz7iUL-jo5BssQFifQuJZ40B4AsYPL5iu42l8HnhFz2isv5zEoogaf_7KjsTpHNZJxy5rwqqLgWVS7OS1C7qg2LsFMPrgIGMkYqvtJayVvpVyu1YJghFs_EhDeZPELTG82rQhBIb0oJMwmGhSv2TlArIESguDO4jQ6-jUG0i3pOg&4u16383&5m1&2e1&callback=none&client=google-maps-pro&token=43379',
    },
    title: '한옥의 정취가 물씬',
    avatar: {
      profile: {
        uri: 'https://manofmany.com/wp-content/uploads/2019/06/50-Long-Haircuts-Hairstyle-Tips-for-Men-5.jpg',
      },
      name: '조나단',
    },
    tags: ['여행', '맛집'],
  },
];

const PostScreen = ({navigation, route}) => {
  const routeName = route.params.text;
  return (
    <>
      <Container>
        <SearchBar navigation={navigation} />
        <ScrollView style={{backgroundColor: '#fff'}}>
          {/* <Header searchBar rounded>
        <InputGroup>
          <Icon name="ios-search" />
          <Input placeholder="Search" />
          <Icon name="ios-people" />
        </InputGroup>
        <Button transparent>Search</Button>
      </Header> */}
          <Content style={{padding: 20}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('home')}
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#4A26F4',
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  marginRight: 5,
                  backgroundColor: '#4A26F4',
                }}>
                <Text style={{fontSize: 15, color: '#fff'}}>여행 x</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('post2', {text: 'home'})}
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  marginRight: 5,
                }}>
                <Text style={{fontSize: 15}}>맛집</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('post3', {text: 'home'})}
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  marginRight: 5,
                }}>
                <Text style={{fontSize: 15}}>카페</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('post4', {text: 'home'})}
                style={{
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  marginRight: 5,
                }}>
                <Text style={{fontSize: 15}}>쇼핑</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginVertical: 20}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>#여행</Text>
              <Content style={{marginVertical: 20}}>
                {adPostGallery.map((post) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('postDetail', {
                        props: post,
                      })
                    }
                    key={post.id}
                    activeOpacity={0.8}>
                    <Image
                      source={post.image}
                      resizeMode="cover"
                      style={styles.contentListImg}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 10,
                      }}>
                      {post.title}
                    </Text>

                    <View style={{flexDirection: 'row', marginBottom: 50}}>
                      <TouchableOpacity
                        style={{
                          borderColor: '#eee',
                          borderRadius: 5,
                          backgroundColor: '#eee',
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          marginRight: 5,
                        }}>
                        <Text style={{color: '#666'}}>여행</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderColor: '#eee',
                          borderRadius: 5,
                          backgroundColor: '#eee',
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                        }}>
                        <Text style={{color: '#666'}}>맛집</Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          marginLeft: 10,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Thumbnail
                          source={post.avatar.profile}
                          style={{width: 30, height: 30}}
                          resizeMode="cover"
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginLeft: 5,
                          }}>
                          {post.avatar.name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </Content>
            </View>
          </Content>
        </ScrollView>
      </Container>
      <BottomTabs navigation={navigation} routeName={routeName} />
    </>
  );
};

const styles = StyleSheet.create({
  contentListImg: {
    width: window,
    height: 180,
    borderRadius: 15,
    marginBottom: 20,
  },
});

export default PostScreen;
