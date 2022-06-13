import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Button, Footer} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {setKeyword, setTag} from '../Module/Reducer';

const BottomTabs = ({navigation, routeName}) => {
  // const token = useSelector((state) => state.Reducer.token);
  const dispatch = useDispatch();

  return (
    <Footer style={styles.bottomTabArea}>
      <Button
        transparent
        onPress={() => {
          dispatch(setKeyword(''));
          dispatch(setTag(''));
          navigation.navigate('home', {text: 'home'});
        }}>
        <Image
          source={
            routeName === 'home'
              ? require('../src/assets/img/bottom_ic01_on.png')
              : require('../src/assets/img/bottom_ic01_off.png')
          }
          style={styles.bottomTabStyle}
          resizeMode="cover"
        />
      </Button>
      <Button
        transparent
        onPress={() => {
          dispatch(setKeyword(''));
          dispatch(setTag(''));
          navigation.navigate('curation', {text: 'curation'});
        }}>
        <Image
          source={
            routeName === 'curation'
              ? require('../src/assets/img/bottom_ic02_on.png')
              : require('../src/assets/img/bottom_ic02_off.png')
          }
          style={styles.bottomTabStyle}
          resizeMode="cover"
        />
      </Button>
      <Button
        transparent
        onPress={() => navigation.navigate('trip', {text: 'trip'})}>
        <Image
          source={
            routeName === 'trip'
              ? require('../src/assets/img/bottom_ic03_on.png')
              : require('../src/assets/img/bottom_ic03_off.png')
          }
          style={styles.bottomTabStyle}
          resizeMode="cover"
        />
      </Button>
      <Button
        transparent
        onPress={() => {
          dispatch(setKeyword(''));
          dispatch(setTag(''));
          navigation.navigate('talk', {text: 'talk'});
        }}>
        <Image
          source={
            routeName === 'talk'
              ? require('../src/assets/img/bottom_ic04_on.png')
              : require('../src/assets/img/bottom_ic04_off.png')
          }
          style={styles.bottomTabStyle}
          resizeMode="cover"
        />
      </Button>
    </Footer>
  );
};

const styles = StyleSheet.create({
  bottomTabArea: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderTopColor: '#BBBBBB',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderWidth: 1,
  },
  bottomTabStyle: {
    width: 70,
    height: 50,
    resizeMode: 'contain',
  },
});

export default BottomTabs;
