import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import userService from '../services/user-service';
import EmailOTPService from '../services/EmailOTP-service';
import {
  TextInput,
  Button,
  Checkbox,
  HelperText,
  ActivityIndicator,
  MD2Colors,
  Modal,
  PaperProvider,
  Portal,
  Text,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {validate, getRandomInt} from '../library/utils/comman';
// import EmailOtpSection from '../component/email-otp-section';

export default function SignUpScreen() {
  const navigation: any = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleOTP, setToggleOTP] = useState(false);
  const [trxnId, setId] = useState('');
  const [token, setToken] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setisConfirmPasswordVisible] =
    useState(false);
  const [otp, setOTP] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isHelperTextVissible, setHelperVissible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [correlation, setCorelation] = useState('');

  // Email validation for specific regex
  const validateEmail = (text: any) => {
    let reg = validate(text);
    if (reg === false) {
      setEmail(text);
      setIsEmailValid(false);
      return false;
    } else {
      setEmail(text);
      setIsEmailValid(true);
      setHelperVissible(false);
    }
  };
  const getAccessToken = async () => {
    try {
      const response = await userService.generateAccessToken();
      await AsyncStorage.setItem('access_token', response.access_token);
      setToken(response.access_token);
    } catch (err) {
      console.log('err', err)
      alert('sign up page acess token error', err);
    }
  };
  useEffect(() => {
    getAccessToken();
  }, []);

  const onSignup = async () => {
    setIsLoading(true);
    if (!email.trim()) {
      setToggleCheckBox(false);
      return;
    }
    const data = {
      schemas: [
        'urn:ietf:params:scim:schemas:core:2.0:User',
        'urn:ietf:params:scim:schemas:extension:ibm:2.0:User',
      ],
      userName: email,
      name: {
        familyName: lastName,
        givenName: firstName,
      },
      emails: [
        {
          value: email,
          type: 'work',
        },
      ],
      password: password,
      'urn:ietf:params:scim:schemas:extension:ibm:2.0:User': {
        userCategory: 'regular',
      },
    };
    try {
      const response = await userService.createUser(data, token);
      if (response.status === 201) {
        setIsLoading(false);
        alert('Registration Successful.');
        navigation.navigate('Login');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setToggleCheckBox(false);
        setConfirmPassword('');
        setIsEmailVerified(false);
        setToggleOTP(false);
      } else {
        setIsLoading(false);
        throw Error;
      }
    } catch (error) {
      setIsLoading(false);
      alert('User ' + email + ' already exits');
      navigation.navigate('Login');
      setFirstName('');
      setEmail('');
      setPassword('');
      setLastName('');
      setConfirmPassword('');
      setIsLoading(false);
      setToggleCheckBox(false);
      setIsEmailVerified(false);
      setToggleOTP(false);
    }
  };
  const onSendOTP = async () => {
    if (!email.trim()) {
      setToggleOTP(false);
      setHelperVissible(true);
      return;
    }
    setToggleOTP(true);
    const body = {
      correlation: getRandomInt(),
      emailAddress: email,
    };
    try {
      const response = await EmailOTPService.generateEmailOTP(token, body);
      setId(response?.data?.id);
      setCorelation(response?.data?.correlation);
    } catch (error) {
      alert('sign up page send otp error', error);
    }
  };
  const onVerifyOTP = async (emailOTP: any) => {
    try {
      const body = {
        otp: emailOTP,
      };
      const response = await EmailOTPService.verifyEmailOTP(
        trxnId,
        token,
        body,
      );
      setIsEmailVerified(true);
      setToggleOTP(false);
      setOTP('');
      alert('Email Verification Successful.', response);
    } catch (error) {
      setIsEmailVerified(false);
      // setToggleOTP(false);
      setOTP('');
      alert('signup page on verify error', error);
    }
  };
  return (
    <PaperProvider>
      <Portal>
        <SafeAreaView style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.backbuttonView}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Welcome')}
                style={styles.backButton}>
                <ArrowLeftIcon size="20" color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
              <TextInput
                label="Email *"
                value={email}
                mode="outlined"
                style={styles.textField}
                activeOutlineColor="rgb(86, 156, 6)"
                onChangeText={text => validateEmail(text)}
                error={!isEmailValid}
                right={
                  <TextInput.Icon
                    icon={
                      isEmailVerified
                        ? 'account-check-outline'
                        : 'account-cancel-outline'
                    }
                    onPress={() => setIsEmailVerified(!isEmailVerified)}
                  />
                }
              />
              {isHelperTextVissible ? (
                <HelperText
                  type="error"
                  visible={isHelperTextVissible}
                  padding="normal">
                  Email address is required!
                </HelperText>
              ) : null}
              {!isEmailVerified ? (
                !toggleOTP ? (
                  <Button
                    mode="contained"
                    style={styles.signupButton}
                    onPress={() => onSendOTP()}>
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <Text variant="bodySmall" style={{marginVertical: 12}}>
                      Please enter 6-digit verification code send on your email.
                    </Text>
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
                          label="Email Verificatio Code"
                          value={otp}
                          mode="outlined"
                          style={styles.textField}
                          activeOutlineColor="rgb(86, 156, 6)"
                          onChangeText={text => setOTP(text)}
                        />
                      </View>
                    </View>
                    <Button
                      mode="contained"
                      style={styles.signupButton}
                      onPress={() => onVerifyOTP(otp)}>
                      Verify Code
                    </Button>
                    <Button
                      mode="contained"
                      style={styles.signupButton}
                      onPress={() => onSendOTP()}>
                      Resend OTP
                    </Button>
                  </>
                )
              ) : null}
              <TextInput
                label="First Name"
                value={firstName}
                mode="outlined"
                style={styles.textField}
                activeOutlineColor="rgb(86, 156, 6)"
                onChangeText={text => setFirstName(text)}
              />
              <TextInput
                label="Last Name"
                value={lastName}
                mode="outlined"
                style={styles.textField}
                activeOutlineColor="rgb(86, 156, 6)"
                onChangeText={text => setLastName(text)}
              />
              <TextInput
                label="Password *"
                value={password}
                mode="outlined"
                style={styles.textField}
                onChangeText={text => setPassword(text)}
                activeOutlineColor="rgb(86, 156, 6)"
                secureTextEntry={!isPasswordVisible}
                right={
                  <TextInput.Icon
                    icon={!isPasswordVisible ? 'eye' : 'eye-off'}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                }
              />
              <TextInput
                label="Confirm Password *"
                value={confirmPassword}
                mode="outlined"
                style={styles.textField}
                error={confirmPassword !== password}
                onChangeText={text => setConfirmPassword(text)}
                activeOutlineColor="rgb(86, 156, 6)"
                secureTextEntry={!isConfirmPasswordVisible}
                right={
                  <TextInput.Icon
                    icon={!isConfirmPasswordVisible ? 'eye' : 'eye-off'}
                    onPress={() =>
                      setisConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  />
                }
              />
              <View style={{marginVertical: 12}}>
                <Text>Terms and Conditions of Use</Text>
                <ScrollView style={styles.scrollText}>
                  <Text variant="bodySmall">
                    1.Terms This is a dummy text. By accessing this app, you are
                    agreeing to be bound by XYZ's Terms and Conditions of Use
                    and agree that you are responsible for the agreement with
                    any applicable local laws. If you disagree with any of these
                    terms, you are prohibited from accessing this site. The
                    materials contained in the app are protected by copyright
                    and trade mark law. 2. Disclaimer All the materials on the
                    app are provided "as is". There are no warranties, may it be
                    expressed or implied, therefore negates all other
                    warranties. Furthermore, this app does not make any
                    representations concerning the accuracy or reliability of
                    the use of the materials on its app or otherwise relating to
                    such materials or any sites linked to this app.
                  </Text>
                </ScrollView>
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={toggleCheckBox ? 'checked' : 'unchecked'}
                  onPress={() => setToggleCheckBox(!toggleCheckBox)}
                />
                <Text style={styles.label}>
                  I agree to AuthenticationAppVerify terms and condition.
                </Text>
              </View>
              {!toggleCheckBox ||
              email === '' ||
              password === '' ||
              confirmPassword === '' ? (
                <Button mode="contained" disabled={true}>
                  Create Account
                </Button>
              ) : (
                <Button
                  mode="contained"
                  style={styles.signupButton}
                  onPress={() => onSignup()}>
                  Create Account
                </Button>
              )}
              <Button mode="contained" style={styles.signupButton}>
                Cancel
              </Button>
            </View>
          </View>
          <Modal visible={isLoading}>
            <ActivityIndicator
              animating={isLoading}
              color={MD2Colors.grey800}
              size="large"
            />
          </Modal>
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
});
