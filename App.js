import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import {
  AppState,
  Dimensions,
  StatusBar,
  Alert,
  Keyboard,
  Linking,
  Text
} from 'react-native'
import { Root, Toast } from 'native-base'
import { useDispatch } from 'react-redux'
// import Toast from 'react-native-toast-message';
// import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage'
import messaging from '@react-native-firebase/messaging'

// ios 아이콘 로딩문제 해결 코드
import Icon from 'react-native-vector-icons/Ionicons'

// import Navigations
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

// Redux Reducers function
import { setToken } from './Screens/Module/Reducer'

/* 화면관리 */

// 스플레시
import SplashScreen from 'react-native-splash-screen'

// 로딩화면
import Loading from './Screens/Loading'

// 공통
import HomeScreen from './Screens/HomeScreen'
import PostScreen from './Screens/PostScreen'
import PostScreen2 from './Screens/PostScreen2'
import PostScreen3 from './Screens/PostScreen3'
import PostScreen4 from './Screens/PostScreen4'
import PostDetails from './Screens/PostDetails'
import NoticeScreen from './Screens/NoticeScreen'
import NoticeDetail from './Screens/NoticeScreen/Detail'
import SearchList from './Screens/Common/SearchList'
import DrawerMenu from './Screens/Common/DrawerMenu'

// 새소식
import CurationScreen from './Screens/CurationScreen'
import CurationDetail from './Screens/CurationScreen/CurationDetail'

// 베가스여행
import TripScreen from './Screens/TripScreen'
import TripDetail from './Screens/TripScreen/Detail'
import Store from './Screens/WebView/Store'

// 베가스톡톡
import TalkScreen from './Screens/TalkScreen'
import TalkDetail from './Screens/TalkScreen/Detail'
import TalkFaq from './Screens/TalkScreen/Faq'
import TalkEdit from './Screens/TalkScreen/Edit'

// 사용자 정보 화면
import EditScreen from './Screens/Profile/EditScreen'
import ReplyScreen from './Screens/Profile/ReplyScreen'
import ScrapScreen from './Screens/Profile/ScrapScreen'
import StoreFaqScreen from './Screens/Profile/StoreFaqScreen'
import StoreFaqComScreen from './Screens/Profile/StoreFaqComScreen'
import FaqScreen from './Screens/Profile/FaqScreen'
import FaqWriteScreen from './Screens/Profile/FaqWriteScreen'
import TalkTalkScreen from './Screens/Profile/TalkTalkScreen'

// 로그인, 회원가입, 아이디/비번찾기
import LoginScreen from './Screens/Auth/LoginScreen'
import RegisterStep01Screen from './Screens/Auth/RegisterStep01Screen'
import RegisterStep02Screen from './Screens/Auth/RegisterStep02Screen'
import RegisterStep03Screen from './Screens/Auth/RegisterStep03Screen'
import RegisterStepSocialScreen from './Screens/Auth/RegisterStepSocialScreen'
import FinderId from './Screens/Auth/FinerId'
import FinderPassword from './Screens/Auth/FinderPassword'
import InsterFeed from './Screens/InsterFeed'
import ChangePW from './Screens/Profile/ChangePassword'

// 사용자 이용약관, 회사소개, 개인정보이용처리방침
import Terms from './Screens/InfoCompany/terms'
import Privacy from './Screens/InfoCompany/privacy'
import InfoCompany from './Screens/InfoCompany/'

// Redux
import { setFcmToken } from './Screens/Module/Reducer'
Icon.loadFont()

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

// firebase iOS 인증
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission({
    sound: false,
    announcement: true,
    alert: true,
    badge: true,
    carPlay: true,
    provisional: false
  })
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    console.log('Authorization status:', authStatus)
  }
}

const StackNavigation = (props) => {
  return (
    <Stack.Navigator>
      {/* 로딩 관련 */}
      <Stack.Screen
        name='loading'
        component={Loading}
        options={{ headerShown: false }}
      />

      {/* 로그인 관련 */}
      <Stack.Screen
        name='login'
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='register_step01'
        component={RegisterStep01Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='register_step02'
        component={RegisterStep02Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='register_step03'
        component={RegisterStep03Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='register_social'
        component={RegisterStepSocialScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='FinderId'
        component={FinderId}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='FinderPassword'
        component={FinderPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='ChangePW'
        component={ChangePW}
        options={{ headerShown: false }}
      />

      {/* WebView 스토어 */}
      <Stack.Screen
        name='Store'
        component={Store}
        options={{ headerShown: false }}
      />

      {/* Detail 화면 */}
      <Stack.Screen
        name='CurationDetail'
        component={CurationDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='TalkFaq'
        component={TalkFaq}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='TalkDetail'
        component={TalkDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='TalkEdit'
        component={TalkEdit}
        options={{ headerShown: false }}
      />

      {/* 공통 */}
      <Stack.Screen
        name='home'
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='post'
        component={PostScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='post2'
        component={PostScreen2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='post3'
        component={PostScreen3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='post4'
        component={PostScreen4}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='postDetail'
        component={PostDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='curation'
        component={CurationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='trip'
        component={TripScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='TripDetail'
        component={TripDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='talk'
        component={TalkScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='userEdit'
        component={EditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='userReply'
        component={ReplyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='userScrap'
        component={ScrapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='userFaq'
        component={FaqScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='userFaqWrite'
        component={FaqWriteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='TalkTalkScreen'
        component={TalkTalkScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='storeFaq'
        component={StoreFaqScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='storeFaqCom'
        component={StoreFaqComScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='notice'
        component={NoticeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='NoticeDetail'
        component={NoticeDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='SearchList'
        component={SearchList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='InsterFeed'
        component={InsterFeed}
        options={{ headerShown: false }}
      />

      {/* 사용자이용약관, 회사소개, 개인정보이용처리방침 */}
      <Stack.Screen
        name='Terms'
        component={Terms}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Privacy'
        component={Privacy}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='InfoCompany'
        component={InfoCompany}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
};

const App = () => {
  const dispatch = useDispatch() // Redux 연결
  // const [isLoading, setLoading] = useState(true); // Loading 설정
  const [currCuId, setCurrCuId] = useState(0)

  const linking = {
    prefixes: ['vegastong://'],
    config: {
      screens: {
        CurationDetail: {
          path: 'curation_detail/:title/:id',
          parse: {
            id: (id) => `${id}`,
            title: (title) => decodeURI(title)
          }
        }
      }
    }
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
  }, [])

  const handleAppStateChange = (nextAppState) => {
    // if (nextAppState === 'active') { // App has come to the foreground
    //   if(this.state.currentBusiness.ID != (ID received in deep link)) // Need to get data
    //        this.getBusiness(ID received in deep link);
    // }
  }

  useEffect(() => {
    Linking.getInitialURL() // 최초 실행 시에 Universal link 또는 URL scheme요청이 있었을 때 여기서 찾을 수 있음
      .then((value) => {
        console.log('getInitialURL', value)
        const decodeUrl = decodeURI(value)
        const cuId = decodeUrl.replace(
          'vegastong://curation_detail/새소식/',
          ''
        )
        setCurrCuId(cuId)
      })

    // 앱이 실행되어있는 상태에서 요청이 왔을 때 처리하는 이벤트 등록
    Linking.addEventListener('url', (e) => {
      const route = e.url.replace(/.*?:\/\//g, '')
      const decodeUrl = decodeURI(e.url)
      const cuId = decodeUrl.replace('vegastong://curation_detail/새소식/', '')

      // console.log('route ??', route);
      console.log('cuId ??', cuId)
      setCurrCuId(cuId)
    })

    return () => {
      Linking.removeEventListener('url', (e) => {
        // 이벤트 해제
        console.log('remove e.url', e.url)
      })
    };
  }, [])

  console.log('currCuId ??', currCuId)

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@vegasTongToken')
      if (value !== null) {
        dispatch(setToken(value))
      } else {
        console.log('AsyncStorage Token is Null')
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 1000)

    getToken()

    messaging().onMessage((remoteMessage) => {
      Toast.show({
        text: `[베가스통]${remoteMessage.notification.title}`,
        buttonText: '확인',
        duration: 10000,
        position: 'top',
        type: 'warning'
      })
    })
  }, [])

  return (
    <>
      <StatusBar hidden />

      <Root>
        <NavigationContainer
          linking={linking}
          // fallback={<Text>Loading...</Text>}
        >
          <Drawer.Navigator
            drawerType='slide'
            drawerPosition='right'
            drawerStyle={{
              backgroundColor: '#fff',
              width: Dimensions.get('window').width * 0.75
            }}
            drawerContent={(props) => <DrawerMenu {...props} />}
          >
            <Drawer.Screen name='StackNavigation' component={StackNavigation} />
          </Drawer.Navigator>
        </NavigationContainer>
      </Root>
    </>
  )
};

export default App
