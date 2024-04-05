import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../views/HomeScreen';
import WelcomeScreen from '../views/WelcomeScreen';
import LoginScreen from '../views/LoginScreen';
import SignUpScreen from '../views/SignupScreen';
import ProfileScreen from '../views/ProfileScreen';
import LoginOptionScreen from '../views/LoginOptionScreen';
import LoginWithPinScreen from '../views/LoginWithPin';
import ProfileUpdateScreen from '../views/ProfileUpdateScreen';
import ChangePasswordScreen from '../views/ChangePassword';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Welcome"
          options={{headerShown: false}}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="Login"
          options={{headerShown: false}}
          component={LoginScreen}
        />
        <Stack.Screen
          name="PinLogin"
          options={{headerShown: false}}
          component={LoginWithPinScreen}
        />
        <Stack.Screen
          name="SignUp"
          options={{headerShown: false}}
          component={SignUpScreen}
        />
        <Stack.Screen
          name="ProfileScreen"
          options={{headerShown: false}}
          component={ProfileScreen}
        />
        <Stack.Screen
          name="LoginOptionScreen"
          options={{headerShown: false}}
          component={LoginOptionScreen}
        />
        <Stack.Screen
          name="ProfileUpdateScreen"
          options={{headerShown: false}}
          component={ProfileUpdateScreen}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          options={{headerShown: false}}
          component={ChangePasswordScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
