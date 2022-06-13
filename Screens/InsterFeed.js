import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Grid,
  Col,
  Row,
} from 'native-base';
import fetch from 'axios';

const {width: screenWidth} = Dimensions.get('window');

const InsterFeed = () => {
  const [data, setData] = useState('1');

  const [img1, setImg1] = useState('2');
  const [img2, setImg2] = useState('3');
  const [img3, setImg3] = useState('4');
  const [img4, setImg4] = useState('5');
  const [img5, setImg5] = useState('6');
  const [img6, setImg6] = useState('7');
  const [img7, setImg7] = useState('8');

  const [img1_SCode, setImg1_SCode] = useState('');
  const [img2_SCode, setImg2_SCode] = useState('');
  const [img3_SCode, setImg3_SCode] = useState('');
  const [img4_SCode, setImg4_SCode] = useState('');
  const [img5_SCode, setImg5_SCode] = useState('');
  const [img6_SCode, setImg6_SCode] = useState('');
  const [img7_SCode, setImg7_SCode] = useState('');

  useEffect(
    useCallback(() => {
      getFeed();
      return () => {
        getFeed();
      };
    }, [data, img1, img2, img3, img4, img5, img6, img7]),
    [getFeed],
  );

  const getFeed = () => {
    fetch('https://www.instagram.com/gongju_ro/')
      .then((res) => {
        console.log(res.data);
        const a = res.data;

        const media = JSON.parse(
          a.slice(
            a.indexOf('edge_owner_to_timeline_media') + 30,
            a.indexOf('edge_saved_media') - 2,
          ),
        );

        console.log('media : ', media);

        media.edges.forEach((m) => {
          const uri = m.node.display_url;
          setData(uri);
        });

        const _data = media.edges;
        setImg1(_data[0].node.display_url);
        setImg1_SCode(_data[0].node.shortcode);
        setImg2(_data[1].node.display_url);
        setImg2_SCode(_data[1].node.shortcode);
        setImg3(_data[2].node.display_url);
        setImg3_SCode(_data[2].node.shortcode);
        setImg4(_data[3].node.display_url);
        setImg4_SCode(_data[3].node.shortcode);
        setImg5(_data[4].node.display_url);
        setImg5_SCode(_data[4].node.shortcode);
        setImg6(_data[5].node.display_url);
        setImg6_SCode(_data[5].node.shortcode);
        setImg7(_data[6].node.display_url);
        setImg7_SCode(_data[6].node.shortcode);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  console.log('Insta Data : ', data);

  const OpenURLButton = async (url) => {
    // Checking if the link is supported for links with custom URL scheme.

    const supported = await Linking.canOpenURL(
      `https://www.instagram.com/p/${url}`,
    );

    if (supported) {
      await Linking.openURL(`https://www.instagram.com/p/${url}`);
    } else {
      Alert.alert('이 게시물을 찾을 수 없습니다.', '관리자에게 문의하세요.', [
        {
          text: '확인',
          onPress: () => {},
        },
      ]);
    }
  };

  const MARGIN = 2;
  const w = screenWidth - 45;

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#ACACAC',
            height: w / 3,
            width: (w / 3) * 2 + MARGIN,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => OpenURLButton(img1_SCode)}>
            <Image
              source={{uri: img1}}
              style={{
                width: (w / 3) * 2 + MARGIN,
                height: (w / 3) * 2,
                marginRight: MARGIN,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            height: (w / 3) * 2,
            width: (w / 3) * 2,
            marginLeft: MARGIN * MARGIN,
            marginBottom: MARGIN,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => OpenURLButton(img2_SCode)}>
            <Image
              source={{uri: img2}}
              style={{
                width: w / 3,
                height: w / 3 - MARGIN,
                marginBottom: MARGIN,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => OpenURLButton(img3_SCode)}>
            <Image
              source={{uri: img3}}
              style={{
                width: w / 3,
                height: w / 3 - MARGIN,
                marginTop: MARGIN,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => OpenURLButton(img4_SCode)}>
          <Image
            source={{uri: img4}}
            style={{
              width: w / 3,
              height: w / 3,
              margin: MARGIN,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => OpenURLButton(img5_SCode)}>
          <Image
            source={{uri: img5}}
            style={{
              width: w / 3,
              height: w / 3,
              margin: MARGIN,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => OpenURLButton(img6_SCode)}>
          <Image
            source={{uri: img6}}
            style={{
              width: w / 3,
              height: w / 3,
              margin: MARGIN,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InsterFeed;
