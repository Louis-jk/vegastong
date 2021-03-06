package com.dmonster.vegastong;

import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

//import com.dooboolab.naverlogin.RNNaverLoginPackage;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

// import io.invertase.firebase.RNFirebasePackage;
// import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
// import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
// import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import androidx.multidex.MultiDexApplication;
// import com.dooboolab.kakaologins.RNKakaoLoginsPackage;

import com.lugg.ReactNativeConfig.ReactNativeConfigPackage; // .env 환경변수 react-native-config 패키지 설치

public class MainApplication extends MultiDexApplication  implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
        // packages.add(new RNNaverLoginPackage());

          // firbase 푸쉬 기능 연동
          // packages.add(new RNFirebasePackage());
          // packages.add(new RNFirebaseAnalyticsPackage());
          // packages.add(new RNFirebaseMessagingPackage());
          // packages.add(new RNFirebaseNotificationsPackage());
//            packages.add(new RNKakaoLoginsPackage()); // kakao
// packages.add(new RNKakaoLoginsPackage());
          new ReactNativeConfigPackage(); // .env 환경변수 react-native-config 패키지 설치
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.dmonster.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
