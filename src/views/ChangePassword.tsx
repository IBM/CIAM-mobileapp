import {StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import Config from 'react-native-config';
import {PaperProvider, Portal} from 'react-native-paper';

const baseUrl = Config.baseUrl;

export default function ChangePasswordScreen({route}) {
  const navigation: any = useNavigation();

  const _onLoad = async state => {
    if (state.url === 'http://localhost:8081/') {
      navigation.navigate('Welcome');
    }
  };

  return (
    <PaperProvider>
      <Portal>
        <SafeAreaView style={styles.container}>
          <WebView
            onNavigationStateChange={_onLoad}
            source={{
              uri: `${baseUrl}/authsvc/mtfim/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:changepassword&login_hint=${route.params.username}&themeId=022313e7-98cb-48e2-bcf2-94c2ecdef0a6`,
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
