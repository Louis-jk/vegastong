import React from 'react';
import {View, Text, TouchableOpacity, Image, Keyboard} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setDrawer} from '../Module/Reducer';

const Header = ({navigation, title}) => {
  const dispatch = useDispatch();

  const setOpenDrawer = () => {
    dispatch(setDrawer(true));
    Keyboard.dismiss();
    navigation.openDrawer();
  };

  return (
    <View style={{paddingHorizontal: 10}}>
      <View
        style={{
          backgroundColor: '#fff',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: 10,
        }}>
        <Image
          style={{
            width: '30%',
            height: 30,
            resizeMode: 'contain',
          }}
          source={require('../src/assets/img/main_logo.png')}
        />
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => {
            Keyboard.dismiss();
            navigation.openDrawer();
          }}>
          <Image
            source={require('../src/assets/img/top_ic_menu_bk.png')}
            resizeMode="cover"
            style={{
              width: 45,
              height: 55,
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={{paddingBottom: 10}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../src/assets/img/top_ic_history.png')}
            resizeMode="contain"
            style={{
              width: 20,
              height: 20,
              marginRight: 5,
              marginLeft: 10,
            }}
          />
          <Text
            style={{
              width: '70%',
              fontSize: 14,
              color: '#000',
              overflow: 'hidden',
            }}
            textBreakStrategy="simple"
            numberOfLines={1}>
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
