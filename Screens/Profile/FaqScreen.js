import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Container, Content, Accordion} from 'native-base';
import qs from 'qs';
import axios from 'axios';
import {useSelector} from 'react-redux';
import Header from '../Common/Header';

const baseUrl = 'https://dmonster1826.cafe24.com';

const FaqScreen = (props) => {
  const navigation = props.navigation;
  const title = props.route.params.title;
  const token = props.route.params.token;

  const [faqLists, setFaqLists] = useState([]);
  const listCount = faqLists.length;

  // Redux 연동
  // const token = useSelector((state) => state.Reducer.token);

  const getMyFaqList = () => {
    axios({
      method: 'get',
      url: `${baseUrl}/api/inquiry/get_my_inquiries`,
      headers: {
        authorization: token,
        'api-secret':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImppaG9vbitqb29uaG8i.Ssj4aWLMewq2e8ZbOBM7rUwlzLPvi6UdZgM93LVVD9U',
      },
    })
      .then((res) => {
        if (res.data.result == 'success') {
          setFaqLists(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // useEffect(() => {
  //   getMyFaqList()
  // }, [])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyFaqList();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const renderHeader = (list, expanded) => {
    return (
      <>
        <View style={{paddingHorizontal: 20}}>
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                lineHeight: 22,
                marginTop: 5,
                marginBottom: 5,
              }}>
              {list.iq_title}
            </Text>
            {expanded ? (
              <Image
                source={require('../src/assets/img/list_up.png')}
                resizeMode="contain"
                style={{width: 35, height: 35}}
              />
            ) : (
              <Image
                source={require('../src/assets/img/list_down.png')}
                resizeMode="contain"
                style={{width: 35, height: 35}}
              />
            )}
          </View>
          <View style={{paddingHorizontal: 10, marginBottom: 15}}>
            <Text style={{fontSize: 14, color: '#ccc'}}>
              {list.iq_updated_at}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#eaeaea',
          }}
        />
      </>
    );
  };

  const renderContent = (list) => {
    return (
      <>
        <View style={{paddingVertical: 20, paddingHorizontal: 20}}>
          <View style={{marginBottom: 20}}>
            <Text
              style={{
                fontSize: 16,
                paddingHorizontal: 10,
              }}>
              {list.iq_content}
            </Text>
          </View>

          {!list.iq_reply ? (
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: '#F8F8F8',
                width: '95%',
                paddingVertical: 15,
                paddingHorizontal: 15,
                borderRadius: 10,
              }}>
              <Text style={{fontSize: 16, color: '#ccc'}}>
                답변이 아직 없습니다.
              </Text>
            </View>
          ) : (
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: '#F8F8F8',
                width: '95%',
                paddingVertical: 15,
                paddingHorizontal: 15,
                borderRadius: 10,
              }}>
              <Text style={{fontSize: 17, color: '#4A26F4', marginBottom: 10}}>
                베가스통 답변
              </Text>
              <Text style={{fontSize: 16, lineHeight: 22}}>
                {list.iq_reply}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#eaeaea',
          }}
        />
      </>
    );
  };

  // ToTop 스크롤
  const scrollRef = useRef(null);
  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const FlatListRef = useRef(null);

  const ScrollTopEventHandler = () => {
    FlatListRef.current?.scrollTo({animated: true, y: 0});
  };

  return (
    <Container style={{position: 'relative'}}>
      <Header navigation={navigation} title={title} />

      {faqLists.length > 10 ? (
        <TouchableOpacity
          onPress={ScrollTopEventHandler}
          style={{
            position: 'absolute',
            bottom: 10,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            borderRadius: 30,
            borderWidth: 1,
            borderColor: '#E3E3E3',
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 5,
            marginBottom: 20,
            zIndex: 5,
            elevation: 0,
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#222222'}}>
            Top
          </Text>
        </TouchableOpacity>
      ) : null}
      <View>
        <View style={{marginVertical: 10, paddingHorizontal: 20}}>
          <Text style={{fontSize: 16, color: '#666666'}}>
            게시글 {listCount}건
          </Text>
        </View>

        {faqLists !== null ? (
          <ScrollView ref={FlatListRef}>
            <Accordion
              dataArray={faqLists}
              renderHeader={renderHeader}
              renderContent={renderContent}
              style={{width: Dimensions.get('window').width}}
            />
          </ScrollView>
        ) : !faqLists.length ? (
          <Text style={{color: '#000'}}>문의한 내용이 없습니다.</Text>
        ) : null}
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('userFaqWrite', {
            title: '1:1문의 쓰기',
            token: token,
          })
        }
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#4A26F4',
          position: 'absolute',
          bottom: 50,
          right: 40,
          elevation: 5,
          zIndex: 5,
        }}>
        {/* <Image
          source={require('../src/assets/img/write_btn.png')}
          resizeMode='contain'
          style={{ width: 70, height: 70 }}
        /> */}
        <Image
          source={require('../src/assets/img/ic_write.png')}
          resizeMode="contain"
          style={{width: 30, height: 55}}
        />
      </TouchableOpacity>
    </Container>
  );
};

export default FaqScreen;
