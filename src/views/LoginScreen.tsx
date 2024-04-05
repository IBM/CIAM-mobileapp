import {StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import Config from 'react-native-config';
import {PaperProvider, Portal} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pkceChallenge from 'react-native-pkce-challenge';

export default function LoginScreen() {
  const navigation: any = useNavigation();

  const challenge = pkceChallenge();
  AsyncStorage.setItem('challenge', JSON.stringify(challenge));

  const _onLoad = async state => {
    if (state.url.indexOf('code') != -1) {
      let token1 = state.url.split('code=')[1];
      let token = token1.split('&grant_id')[0];

      // const response = await userService.getAccessToken(token);
      // await AsyncStorage.setItem('login_token', JSON.stringify(response.data));
      navigation.navigate('Home', {
        code: token,
      });
    }
  };

  return (
    <PaperProvider>
      <Portal>
        <SafeAreaView style={styles.container}>
          <WebView
            onNavigationStateChange={_onLoad}
            source={{
              uri: `${Config.baseUrl}/oauth2/authorize?client_id=${Config.client_id}&client_secret=${Config.client_secret}&code_challenge=${challenge.codeChallenge}&code_challenge_method=S256&response_type=code&redirect_uri=http://localhost:8081/home&scope=openid`,
            }}
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
