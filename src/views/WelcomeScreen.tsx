import {View, StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Appbar, Text, Button} from 'react-native-paper';

export default function WelcomeScreen() {
  const navigation: any = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
          <Appbar.Header style={styles.appHeader}>
            <Appbar.Content
              titleStyle={{color: '#ffffff', alignSelf: 'center'}}
              title="Get Started"
            />
          </Appbar.Header>
        </View>
        <View>
          <Text variant="headlineLarge" style={styles.title}>
            Sign in securely from anywhere
          </Text>
        </View>
        <View style={styles.buttonSection}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.signupButton}>
            Create an account
          </Button>
          <View style={styles.accountSection}>
            <Text variant="bodyLarge">Already have an account?</Text>
            <Text
              variant="titleMedium"
              style={styles.loginText}
              onPress={() => navigation.navigate('LoginOptionScreen')}>
              Login
            </Text>
          </View>
        </View>
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
    flex: 1,
  },
  appHeader: {
    backgroundColor: 'rgb(86, 156, 6)',
  },
  loginText: {
    color: 'rgb(86, 156, 6)',
    marginLeft: 4,
  },
  signupButton: {
    width: '100%',
    backgroundColor: 'rgb(86, 156, 6)'
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
  accountSection: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
