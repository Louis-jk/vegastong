import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setTag} from '../../Module/Reducer';

const Travel = (props) => {
  const navigation = props.navigation;
  const isActive = props.isActive;
  const dispatch = useDispatch();
  const tag = useSelector((state) => state.Reducer.tag);

  const searchTag = () => {
    if (tag === 'travel') {
      dispatch(setTag(''));
    } else {
      dispatch(setTag('travel'));
    }
    navigation.navigate('SearchList', {text: 'home'});
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={searchTag}
      style={{
        flexDirection: isActive ? 'row' : null,
        justifyContent: isActive ? 'center' : null,
        alignItems: isActive ? 'center' : null,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: isActive ? '#4A26F4' : '#4A26F4',
        borderRadius: 40,
        paddingVertical: 7,
        paddingHorizontal: 18,
        marginRight: 5,
        backgroundColor: isActive ? '#4A26F4' : '#fff',
      }}>
      <Text
        style={{
          fontSize: 14,
          color: isActive ? '#fff' : '#4A26F4',
          marginRight: isActive ? 7 : 0,
        }}>
        여행
      </Text>
      {isActive ? (
        <Image
          source={require('../../src/assets/img/_ic_del_small.png')}
          style={{width: 10, height: 10}}
          resizeMode="contain"
        />
      ) : null}
    </TouchableOpacity>
  );
};

export default Travel;
