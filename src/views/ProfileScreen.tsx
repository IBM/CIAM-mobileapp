import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Appbar, Text, PaperProvider, Portal} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import Config from 'react-native-config';

export default function MyProfileScreen() {
  const navigation: any = useNavigation();
  const [logoutState, setLogout] = useState(false);

  const logout = async () => {
    setLogout(true);
    // await AsyncStorage.removeItem('login_token');
    navigation.navigate('Welcome');
  };

  return (
    <PaperProvider>
      <Portal>
        <SafeAreaView style={styles.container}>
          {/* <View> */}
          <View>
            <Appbar.Header style={styles.appHeader}>
              <Appbar.BackAction onPress={() => navigation.goBack()} />
              <Appbar.Content
                titleStyle={{color: '#ffffff', alignSelf: 'center'}}
                title="Profile"
              />
            </Appbar.Header>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.dividerContainer}>
              <Text
                variant="titleMedium"
                style={styles.forgotPwdText}
                onPress={() => navigation.navigate('PinLogin')}>
                Set Pin for Authentication
              </Text>
              <Text
                variant="titleMedium"
                style={styles.forgotPwdText}
                onPress={() =>
                  navigation.navigate('ProfileUpdateScreen', {
                    key: 'info',
                  })
                }>
                Personal Info
              </Text>
              <Text
                variant="titleMedium"
                style={styles.forgotPwdText}
                onPress={() =>
                  navigation.navigate('ProfileUpdateScreen', {
                    key: 'email',
                  })
                }>
                Update EmailId
              </Text>
              <Text
                variant="titleMedium"
                style={styles.forgotPwdText}
                onPress={() =>
                  navigation.navigate('ProfileUpdateScreen', {
                    key: 'phone',
                  })
                }>
                Update PhoneNo
              </Text>
              <Text
                variant="titleMedium"
                style={styles.forgotPwdText}
                onPress={() =>
                  navigation.navigate('ProfileUpdateScreen', {
                    key: 'delete',
                  })
                }>
                Delete Account
              </Text>
              <Text
                variant="titleMedium"
                style={styles.forgotPwdText}
                onPress={() =>
                  navigation.navigate('ProfileUpdateScreen', {
                    key: 'changePassword',
                  })
                }>
                Change Password
              </Text>
              <Text
                variant="titleMedium"
                style={styles.forgotPwdText}
                onPress={() => logout()}>
                Logout
              </Text>
            </View>
            {logoutState && (
              <WebView
                source={{
                  uri: `${Config.baseUrl}/idaas/mtfim/sps/idaas/logout?themeId=022313e7-98cb-48e2-bcf2-94c2ecdef0a6`,
                }}
              />
            )}
          </View>
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
    padding: 20,
  },
  dividerContainer: {
    marginVertical: 10,
  },
  innerContainerText: {
    padding: 20,
  },
  appHeader: {
    backgroundColor: 'rgb(86, 156, 6)',
  },
  textContainer: {
    padding: 12,
    alignItems: 'center',
    flexDirection: 'column',
  },
  forgotPwdText: {
    color: 'rgb(86, 156, 6)',
    marginLeft: 20,
    marginVertical: 10,
  },
  profileIcon: {
    alignSelf: 'flex-end',
  },
  listItemSection: {
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  listItemContainer: {
    flexDirection: 'column',
    display: 'flex',
    width: '100%',
  },
  avatarIcon: {
    backgroundColor: 'rgb(86, 156, 6)',
  },
});
