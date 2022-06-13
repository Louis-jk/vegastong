import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Header, Item, Text} from 'native-base';
// import { TouchableOpacity } from 'react-native-gesture-handler';

// import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'
// MIcon.loadFont();

const Selector = ({navigation, toggleModal, selected}) => {
  return (
    <View>
      <Header
        searchBar
        rounded
        hasSegment
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
          onPress={() => navigation.openDrawer()}>
          <Image
            source={require('../src/assets/img/top_ic_menu_bk.png')}
            resizeMode="cover"
            style={{
              width: 45,
              height: 55,
            }}
          />
        </TouchableOpacity>
      </Header>
      <View style={{paddingHorizontal: 20, paddingBottom: 10}}>
        <TouchableOpacity
          onPress={toggleModal}
          style={{
            backgroundColor: '#F8F8F8',
            borderRadius: 10,
            paddingHorizontal: 10,
            width: '100%',
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text>{selected}</Text>
          <Image
            source={require('../src/assets/img/ic_select.png')}
            resizeMode="contain"
            style={{width: 15, height: 15}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Selector;
