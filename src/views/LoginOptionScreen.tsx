import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Button, Appbar} from 'react-native-paper';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import AuthenticationService from '../services/Authentication-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  hasUserSetPinCode,
  deleteUserPinCode,
} from '@haskkor/react-native-pincode';

export default function LoginOptionScreen() {
  const navigation: any = useNavigation();

  const [pinCodeSet, updatePinCodeSet] = useState(false);

  useEffect(() => {
    const getPinStatus = async () => {
      try {
        let res = await hasUserSetPinCode();
        updatePinCodeSet(res);
      } catch (e) {
        // alert('There is no data for this user');
      }
    };
    getPinStatus();
  });

  const getAuthToken = async () => {
    try {
      const tokenDetails = await AsyncStorage.getItem('login_token');
      const details = JSON.parse(tokenDetails);
      const response = await AuthenticationService.getToken(
        details.refresh_token,
      );
      await AsyncStorage.setItem('login_token', JSON.stringify(response.data));
      navigation.navigate('Home');
      // storeToken(response.data.access_token);
    } catch (e) {
      console.log('error here is', e);
      // console.error(e);
    }
  };

  const loginBiometrics = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    rnBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType} = resultObject;

      if (available && biometryType === BiometryTypes.Biometrics) {
        rnBiometrics
          .simplePrompt({promptMessage: 'Confirm fingerprint'})
          .then(resultObject => {
            const {success} = resultObject;

            if (success) {
              getAuthToken();
            } else {
              console.log('Login user cancelled biometric prompt');
            }
          })
          .catch(() => {
            console.log('login biometrics failed');
          });
      } else {
        console.log('login Biometrics not supported');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            titleStyle={{color: '#ffffff', alignSelf: 'center'}}
            title="Login Options"
          />
      </Appbar.Header>
      <View style={styles.innerContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.signupButton}>
          Login with username and password
        </Button>
        <Button
          mode="contained"
          style={styles.signupButton}
          onPress={() => loginBiometrics()}>
          Login with biometrics
        </Button>
        {pinCodeSet && (
          <Button
            mode="contained"
            style={styles.signupButton}
            onPress={() => navigation.navigate('PinLogin')}>
            Login with Pin
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
  appHeader: {
    backgroundColor: 'rgb(86, 156, 6)',
  },
  appHeaderContent: {
    color: '#ffffff',
  },
  loginText: {
    color: 'rgb(86, 156, 6)',
  },
  signupButton: {
    // width: '100%',
    backgroundColor: 'rgb(86, 156, 6)',
    marginVertical: 12,
  },
  title: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  buttonSection: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    padding: 20,
  },
  accountText: {
    marginTop: 10,
    justifyContent: 'center',
  },
});
