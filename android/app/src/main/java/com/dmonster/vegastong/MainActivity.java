package com.dmonster.vegastong;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
      PackageInfo packageInfo = null;
      try {
          packageInfo = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_SIGNATURES);
      } catch (PackageManager.NameNotFoundException e) {
          e.printStackTrace();
      }
      if (packageInfo == null)
          Log.e("KeyHash", "KeyHash:null");

      for (Signature signature : packageInfo.signatures) {
          try {
              MessageDigest md = MessageDigest.getInstance("SHA");
              md.update(signature.toByteArray());
              Log.d("KeyHash", Base64.encodeToString(md.digest(), Base64.DEFAULT));
          } catch (NoSuchAlgorithmException e) {
              Log.e("KeyHash", "Unable to get MessageDigest. signature=" + signature, e);
          }
      }
    }
   @Override
  protected String getMainComponentName() {
    return "vegastong";
  }
  
}
