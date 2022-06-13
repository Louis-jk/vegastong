import React, {useState} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const [tokenValue, setTokenValue] = useState('');

const readToken = async () => {
  try {
    const resToken = await AsyncStorage.getItem('token');

    if (resToken !== null) {
      setTokenValue(resToken);
      console.log(tokenValue);
    }
  } catch (e) {
    alert('Failed to fetch the data from storage');
  }
};

const getToken = await AsyncStorage.getItem('token');
setTokenValue(getToken);

const AsyncStorage = () => {
  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default AsyncStorage;
