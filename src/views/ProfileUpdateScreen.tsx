import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import userService from '../services/user-service';
import emailOtpService from '../services/EmailOTP-service';
import smsOTPService from '../services/SmsOTP-service';
import {
  TextInput,
  Button,
  Appbar,
  PaperProvider,
  Portal,
  Text,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {validate, getRandomInt} from '../library/utils/comman';
import Config from 'react-native-config';
import {WebView} from 'react-native-webview';

const baseUrl = Config.baseUrl;

export default function ProfileUpdateScreen({route}) {
  const navigation: any = useNavigation();
  const [userData, setUserData] = useState({});
  const [correlation, setCorrelation] = useState('');
  const [emailStatus, setEmailStatus] = useState('unverified');
  const [smsStatus, setSmsStatus] = useState('unverified');
  const [trxnId, setTrxnId] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [smsTrxnId, setSmsTrxnId] = useState('');
  const [smsCorrelation, setSmsCorrelation] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');

  const {key} = route.params;

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const tokenDetails = await AsyncStorage.getItem('login_token');
        const details = JSON.parse(tokenDetails);
        const response = await userService.getUserData(details.access_token);
        setUserData(response.data);
      } catch (e) {
        alert('There is no data for this user');
      }
    };
    getUserDetails();
  }, [userData.id]);

  const updateDetails = (text, type) => {
    let updatedUserData = userData;
    let updatedName = userData.name;
    let updatedAddress = userData.address;
    let updatedEmail = userData.emails[0];
    let updatedPhone = userData.phoneNumbers ? userData.phoneNumbers[0] : {};
    if (type === 'userName') {
      updatedUserData = {
        ...userData,
        userName: text,
      };
      setUserData(updatedUserData);
    } else if (
      type === 'givenName' ||
      type === 'middleName' ||
      type === 'familyName'
    ) {
      updatedUserData = {
        ...userData,
        name: {
          ...updatedName,
          [type]: text,
        },
      };
      setUserData(updatedUserData);
    } else if (
      type === 'streetAddress' ||
      type === 'region' ||
      type === 'locality' ||
      type === 'postalCode' ||
      type === 'country'
    ) {
      updatedUserData = {
        ...userData,
        addresses: [
          {
            ...updatedAddress,
            [type]: text,
          },
        ],
      };
      setUserData(updatedUserData);
    } else if (type === 'email') {
      updatedUserData = {
        ...userData,
        emails: [
          {
            ...updatedEmail,
            value: text,
          },
        ],
      };
      setUserData(updatedUserData);
    } else if (type === 'phone') {
      updatedUserData = {
        ...userData,
        phoneNumbers: [
          {
            ...updatedPhone,
            value: text,
            type: 'work',
          },
        ],
      };
      setUserData(updatedUserData);
    }
    
  };

  const onFormSubmit = async () => {
    try {
      let token = (await AsyncStorage.getItem('login_token')) || '';
      let tokenDetails = JSON.parse(token);
      let response = await userService.updateUserData(
        tokenDetails.access_token,
        userData,
      );
      if (response.status === 200) {
        alert('Profile updated successfully');
      }
    } catch (error: any) {
      alert(error.response.data.detail);
    }
  };

  const onEmailUpdate = async () => {
    const email = userData.emails[0].value;
    const body = {
      emails: [
        {
          type: 'work',
          value: email,
        },
      ],
      addresses: userData.addresses ? userData.addresses : [],
      schemas: [
        'urn:ietf:params:scim:schemas:core:2.0:User',
        'urn:ietf:params:scim:schemas:extension:ibm:2.0:User',
      ],
      name: userData.name,
      active: true,
      userName: userData.userName,
      phoneNumbers: userData.phoneNumbers ? userData.phoneNumbers : [],
    };
    try {
      let token = (await AsyncStorage.getItem('login_token')) || '';
      let tokenDetails = JSON.parse(token);
      let response = await userService.updateUserData(
        tokenDetails.access_token,
        body,
      );
      if (response.status === 200) {
        alert('User email updated successfully');
      }
    } catch (error: any) {
      alert(error.response.data.detail);
    }
  };

  const onPhoneUpdate = async () => {
    const phoneNo = userData.phoneNumbers[0].value;

    const body = {
      emails: userData.emails ? userData.emails : [],
      addresses: userData.addresses ? userData.addresses : [],
      schemas: [
        'urn:ietf:params:scim:schemas:core:2.0:User',
        'urn:ietf:params:scim:schemas:extension:ibm:2.0:User',
      ],
      name: userData.name,
      active: true,
      userName: userData.userName,
      phoneNumbers: [
        {
          type: 'work',
          value: phoneNo,
        },
      ],
    };
    try {
      let token = (await AsyncStorage.getItem('login_token')) || '';
      let tokenDetails = JSON.parse(token);
      let response = await userService.updateUserData(
        tokenDetails.access_token,
        body,
      );
      if (response.status === 200) {
        alert('User phone number updated successfully');
      }
    } catch (error: any) {
      alert(error.response.data.detail);
    }
  };

  const onSendOTP = async () => {
    const email = userData.emails[0].value;
    let token = (await AsyncStorage.getItem('login_token')) || '';
    let tokenDetails = JSON.parse(token);

    const body = {
      correlation: getRandomInt(),
      emailAddress: email,
    };
    try {
      const response = await emailOtpService.generateEmailOTP(
        tokenDetails.access_token,
        body,
      );
      if (response.status === 201) {
        setTrxnId(response.data.id);
        setCorrelation(response.data.correlation);
        setEmailStatus('otpSent');
        alert('OTP send to your email');
      }
    } catch (error) {
      alert('update email send otp error');
    }
  };

  const onVerifyOTP = async () => {
    try {
      const body = {
        otp: emailOtp,
      };
      let token = (await AsyncStorage.getItem('login_token')) || '';
      let tokenDetails = JSON.parse(token);
      const response = await emailOtpService.verifyEmailOTP(
        trxnId,
        tokenDetails.access_token,
        body,
      );
      if (response.status === 200) {
        setEmailStatus('emailVerified');
        alert('Email Verified Successfully');
      }
    } catch (error) {
      alert('Error on verify OTP');
    }
  };

  const onSendSmsOTP = async () => {
    const phoneNo = userData.phoneNumbers[0].value;

    let token = (await AsyncStorage.getItem('login_token')) || '';
    let tokenDetails = JSON.parse(token);

    const body = {
      correlation: getRandomInt(),
      phoneNumber: phoneNo,
    };
    try {
      const response = await smsOTPService.generateSmsOTP(
        tokenDetails.access_token,
        body,
      );
      if (response.status === 201) {
        setSmsStatus('smsOtpSent')
        setSmsTrxnId(response.data.id);
        setSmsCorrelation(response.data.correlation);
        alert('OTP sms send to your phone');
      }
    } catch (error) {
      alert('sign up page send otp error');
    }
  };

  const onVerifySmsOTP = async () => {
    // const { phoneOtp } = this.userSmsForm.value
    try {
      const body = {
        otp: phoneOtp,
      };
      let token = (await AsyncStorage.getItem('login_token')) || '';
      let tokenDetails = JSON.parse(token);
      const response = await smsOTPService.verifySmsOTP(
        smsTrxnId,
        tokenDetails.access_token,
        body,
      );
      if (response.status === 200) {
        setSmsStatus('smsVerified');
        alert('Phone number Verified Successfully');
      }
    } catch (error) {
      alert('Error on verify OTP');
    }
  };

  const onDeleteAccount = async () => {
    let token = (await AsyncStorage.getItem('login_token')) || '';
    let tokenDetails = JSON.parse(token);
    const response = await userService.deleteUser(tokenDetails.access_token);
    if (response.status == 204) {
      AsyncStorage.removeItem('login_token');
      navigation.navigate('Welcome');
    }
  };

  return (
    <PaperProvider>
      <Portal>
        {key === 'info' && (
          <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
              <View>
                <Appbar.Header style={styles.appHeader}>
                  <Appbar.BackAction onPress={() => navigation.goBack()} />
                  <Appbar.Content
                    titleStyle={{color: '#ffffff', alignSelf: 'center'}}
                    title="Profile"
                  />
                </Appbar.Header>
              </View>
              {userData && userData.id && (
                <ScrollView style={styles.scrollText}>
                  <View style={styles.formContainer}>
                    <Text variant="headlineMedium"> User Information </Text>
                    <TextInput
                      label="Username"
                      value={userData.userName}
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text => updateDetails(text, 'userName')}
                    />
                    <TextInput
                      label="First Name"
                      value={userData.name.givenName}
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text => updateDetails(text, 'givenName')}
                    />
                    <TextInput
                      label="Middle Name"
                      value={userData.name.middleName}
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text => updateDetails(text, 'middleName')}
                    />
                    <TextInput
                      label="Last Name"
                      value={userData.name.familyName}
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text => updateDetails(text, 'familyName')}
                    />
                    <Text variant="headlineMedium"> Work Address </Text>
                    <TextInput
                      label="Street Address"
                      value={
                        userData.addresses &&
                        userData.addresses[0].streetAddress
                      }
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text =>
                        updateDetails(text, 'streetAddress')
                      }
                    />
                    <TextInput
                      label="City"
                      value={
                        userData.addresses && userData.addresses[0].locality
                      }
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text => updateDetails(text, 'locality')}
                    />
                    <TextInput
                      label="State"
                      value={userData.addresses && userData.addresses[0].region}
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text => updateDetails(text, 'region')}
                    />
                    <TextInput
                      label="Zip Code"
                      value={
                        userData.addresses && userData.addresses[0].postalCode
                      }
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text => updateDetails(text, 'postalCode')}
                    />
                    <TextInput
                      label="Country"
                      value={
                        userData.addresses && userData.addresses[0].country
                      }
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text => updateDetails(text, 'country')}
                    />
                    <Button
                      mode="contained"
                      style={styles.signupButton}
                      onPress={() => onFormSubmit()}>
                      Save
                    </Button>
                    <Button
                      onPress={() => navigation.navigate('ProfileScreen')}
                      mode="contained"
                      style={styles.signupButton}>
                      Cancel
                    </Button>
                  </View>
                </ScrollView>
              )}
            </View>
          </SafeAreaView>
        )}
        {key === 'email' && (
          <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
              <View>
                <Appbar.Header style={styles.appHeader}>
                  <Appbar.BackAction onPress={() => navigation.goBack()} />
                  <Appbar.Content
                    titleStyle={{color: '#ffffff', alignSelf: 'center'}}
                    title="Profile"
                  />
                </Appbar.Header>
              </View>
              {userData && userData.id && (
                <ScrollView style={styles.scrollText}>
                  <View style={styles.formContainer}>
                    <Text variant="headlineMedium"> User Information </Text>
                    <TextInput
                      label="Email Id"
                      value={userData.emails[0].value}
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text => updateDetails(text, 'email')}
                    />
                    <Text variant="bodySmall">
                      {' '}
                      Please verify above email, you will able to update once it
                      is verified. OTP will be sent to your emailId{' '}
                    </Text>
                    {!correlation && correlation.length == 0 && (
                      <Button
                        mode="contained"
                        style={styles.signupButton}
                        onPress={() => onSendOTP()}>
                        Send OTP
                      </Button>
                    )}
                    {correlation && correlation.length > 0 && emailStatus === 'otpSent' && (
                      <>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1, marginRight: 4}}>
                            <TextInput
                              label="Code"
                              value={correlation}
                              mode="outlined"
                              style={styles.textField}
                              activeOutlineColor="rgb(86, 156, 6)"
                            />
                          </View>
                          <View style={{flex: 2}}>
                            <TextInput
                              label="Verification Code"
                              value={emailOtp}
                              mode="outlined"
                              style={styles.textField}
                              activeOutlineColor="rgb(86, 156, 6)"
                              onChangeText={text => setEmailOtp(text)}
                            />
                          </View>
                        </View>
                        <Button
                          mode="contained"
                          style={styles.signupButton}
                          onPress={() => onVerifyOTP()}>
                          Verify Code
                        </Button>
                      </>
                    )}
                    <Button
                      mode="contained"
                      style={styles.signupButton}
                      disabled={emailStatus !== 'emailVerified'}
                      onPress={() => onEmailUpdate()}>
                      Save
                    </Button>
                    <Button
                      onPress={() => navigation.navigate('ProfileScreen')}
                      mode="contained"
                      style={styles.signupButton}>
                      Cancel
                    </Button>
                  </View>
                </ScrollView>
              )}
            </View>
          </SafeAreaView>
        )}
        {key === 'phone' && (
          <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
              <View>
                <Appbar.Header style={styles.appHeader}>
                  <Appbar.BackAction onPress={() => navigation.goBack()} />
                  <Appbar.Content
                    titleStyle={{color: '#ffffff', alignSelf: 'center'}}
                    title="Profile"
                  />
                </Appbar.Header>
              </View>
              {userData && userData.id && (
                <ScrollView style={styles.scrollText}>
                  <View style={styles.formContainer}>
                    <Text variant="headlineMedium"> User Information </Text>
                    <TextInput
                      label="Phone No"
                      value={
                        userData.phoneNumbers && userData.phoneNumbers[0].value
                      }
                      mode="outlined"
                      style={styles.textField}
                      activeOutlineColor="rgb(86, 156, 6)"
                      onChangeText={text => updateDetails(text, 'phone')}
                    />
                    <Text variant="bodySmall">
                      {' '}
                      Please verify above phone number, you will able to update
                      once it is verified. OTP will be sent to you via sms{' '}
                    </Text>
                    {!smsCorrelation && smsCorrelation.length === 0 && <Button
                      mode="contained"
                      style={styles.signupButton}
                      onPress={() => onSendSmsOTP()}>
                      Send OTP
                    </Button>}
                    {smsCorrelation && smsCorrelation.length > 0 && smsStatus === 'smsOtpSent' && (
                      <>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1, marginRight: 4}}>
                            <TextInput
                              label="Code"
                              value={smsCorrelation}
                              mode="outlined"
                              style={styles.textField}
                              activeOutlineColor="rgb(86, 156, 6)"
                            />
                          </View>
                          <View style={{flex: 2}}>
                            <TextInput
                              label="Verification Code"
                              value={phoneOtp}
                              mode="outlined"
                              style={styles.textField}
                              activeOutlineColor="rgb(86, 156, 6)"
                              onChangeText={text => setPhoneOtp(text)}
                            />
                          </View>
                        </View>
                        <Button
                          mode="contained"
                          style={styles.signupButton}
                          onPress={() => onVerifySmsOTP()}>
                          Verify Code
                        </Button>
                      </>
                    )}
                    <Button
                      mode="contained"
                      style={styles.signupButton}
                      disabled={smsStatus !== 'smsVerified'}
                      onPress={() => onPhoneUpdate()}>
                      Save
                    </Button>
                    <Button
                      onPress={() => navigation.navigate('ProfileScreen')}
                      mode="contained"
                      style={styles.signupButton}>
                      Cancel
                    </Button>
                  </View>
                </ScrollView>
              )}
            </View>
          </SafeAreaView>
        )}
        {key === 'delete' && (
          <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
              <View>
                <Appbar.Header style={styles.appHeader}>
                  <Appbar.BackAction onPress={() => navigation.goBack()} />
                  <Appbar.Content
                    titleStyle={{color: '#ffffff', alignSelf: 'center'}}
                    title="Profile"
                  />
                </Appbar.Header>
              </View>
              {userData && userData.id && (
                <ScrollView style={styles.scrollText}>
                  <View style={styles.formContainer}>
                    <Text variant="headlineMedium">
                      {' '}
                      Are you sure you want to delete this account?{' '}
                    </Text>
                    <Button
                      mode="contained"
                      style={styles.signupButton}
                      onPress={() => onDeleteAccount()}>
                      Yes
                    </Button>
                  </View>
                </ScrollView>
              )}
            </View>
          </SafeAreaView>
        )}
        {key === 'changePassword' && (
          <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
              <View>
                <Appbar.Header style={styles.appHeader}>
                  <Appbar.BackAction onPress={() => navigation.goBack()} />
                  <Appbar.Content
                    titleStyle={{color: '#ffffff', alignSelf: 'center'}}
                    title="Profile"
                  />
                </Appbar.Header>
              </View>
              {userData && userData.id && (
                <ScrollView style={styles.scrollText}>
                  <View style={styles.formContainer}>
                    <Text variant="headlineMedium">
                      {' '}
                      Are you sure you want to change the password?{' '}
                    </Text>
                    <Button
                      mode="contained"
                      style={styles.signupButton}
                      onPress={() =>
                        navigation.navigate('ChangePasswordScreen', {
                          username: userData.userName,
                        })
                      }>
                      Yes
                    </Button>
                  </View>
                </ScrollView>
              )}
            </View>
          </SafeAreaView>
        )}
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
    paddingTop: 20,
  },
  textField: {
    marginVertical: 8,
  },
  signupButton: {
    backgroundColor: 'rgb(86, 156, 6)',
    marginVertical: 8,
  },
  scrollText: {
    height: 100,
    marginHorizontal: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    margin: 8,
  },
  appHeader: {
    backgroundColor: 'rgb(86, 156, 6)',
  },
});
