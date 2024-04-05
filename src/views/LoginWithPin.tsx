import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {PaperProvider, Portal} from 'react-native-paper';
import PINCode, {
  hasUserSetPinCode,
  deleteUserPinCode,
} from '@haskkor/react-native-pincode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthenticationService from '../services/Authentication-service';

export default function LoginWithPinScreen() {
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

  const finalProcess = async () => {
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
      console.error(e);
    }
  };

  return (
    <PaperProvider>
      <Portal>
        <SafeAreaView style={styles.container}>
          <PINCode
            status={pinCodeSet ? 'enter' : 'choose'}
            finishProcess={async () => finalProcess()}
            maxAttempts={15}
            pinCodeVisible={true}
          />
        </SafeAreaView>
      </Portal>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
  },
  backbuttonView: {
    padding: 12,
    justifyContent: 'flex-start',
  },
  backButton: {
    marginLeft: 16,
  },
  formContainer: {
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 32,
  },
  linkText: {
    color: 'rgb(86, 156, 6)',
  },
  forgotText: {
    alignItems: 'flex-end',
    marginVertical: 8,
  },
  newAccountLink: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  normalText: {
    marginBottom: 20,
  },
  textField: {
    marginVertical: 4,
  },
  signupButton: {
    backgroundColor: 'rgb(86, 156, 6)',
    marginVertical: 8,
  },
});
