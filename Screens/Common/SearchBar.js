import React, {useState, useEffect} from 'react';
import {Image, TouchableOpacity, Text, View} from 'react-native';
import {Header, Item, Input} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {setKeyword} from '../Module/Reducer';
// import { TouchableOpacity } from 'react-native-gesture-handler';

const SearchBar = ({navigation}) => {
  const [searchText, setSearchText] = useState('');

  // Redux 키워드 값 가져오기
  const keyword = useSelector((state) => state.Reducer.keyword);
  const dispatch = useDispatch();

  useEffect(() => {
    setSearchText(keyword);
  }, [keyword]);

  const deleteKeyword = () => {
    setSearchText('');
    dispatch(setKeyword(''));
  };
  const onSubmit = () => {
    dispatch(setKeyword(searchText));
    navigation.navigate('SearchList', {text: 'home', keyword: searchText});
  };

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

      <View style={{paddingHorizontal: 15, paddingBottom: 10}}>
        <Item
          style={{
            backgroundColor: '#E8EBFB',
            borderRadius: 10,
            paddingHorizontal: 10,
            height: 42,
            borderColor: 'transparent',
          }}>
          <Input
            placeholder="검색어를 입력해주세요"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            placeholderTextColor="#4A26F4"
            autoCapitalize="none"
            style={{
              fontSize: 14,
            }}
            // multiline={true}
            onSubmitEditing={onSubmit}
          />
          {searchText !== '' ? (
            <TouchableOpacity onPress={deleteKeyword}>
              <Image
                source={require('../src/assets/img/ic_del.png')}
                resizeMode="contain"
                style={{width: 23, height: 23, marginRight: 10}}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={onSubmit}>
            <Image
              source={require('../src/assets/img/ic_sch_or.png')}
              resizeMode="contain"
              style={{width: 25, height: 25, marginRight: 5}}
            />
          </TouchableOpacity>
        </Item>
      </View>
    </View>
  );
};

export default SearchBar;
