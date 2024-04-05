import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Appbar, Divider, Text, DataTable} from 'react-native-paper';
import userService from '../services/user-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({route}) {
  const navigation: any = useNavigation();
  const [userDetail, setUserDetail] = useState({
    id: '',
    name: {
      formatted: '',
    },
  });
  const [stats, setStats] = useState([]);

  const onAccount = () => {
    navigation.navigate('ProfileScreen');
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        if (route.params && route.params.code && userDetail.id.length <= 0) {
          const res = await userService.getAccessToken(route.params.code);
          await AsyncStorage.setItem('login_token', JSON.stringify(res.data));
          const response = await userService.getUserData(res.data.access_token);
          setUserDetail(response.data);
        } else {
          let res = await AsyncStorage.getItem('login_token')
          let details = JSON.parse(res);
          const response = await userService.getUserData(details.access_token);
          setUserDetail(response.data);
        }
      } catch (e) {
        console.log('error in home', e);
        // alert('There is no data for this user');
      }
    };
    getUserDetails();
  }, [userDetail.id]);

  useEffect(() => {
    const getUserStats = async () => {
      try {
        const tokenDetails = await AsyncStorage.getItem('login_token');
        const details = JSON.parse(tokenDetails);
        const response = await userService.getStats(details.access_token);
        setStats(response.data);
      } catch (e) {
        // alert('There is no data for this user');
      }
    };
    getUserStats();
  }, [stats.length > 0]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Appbar.Header style={styles.appHeader}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            titleStyle={{color: '#ffffff', alignSelf: 'center'}}
            title="Service"
          />
          <Appbar.Action
            icon="account"
            onPress={() => onAccount()}
            color="#ffffff"
          />
        </Appbar.Header>
      </View>
      <View style={styles.innerContainer}>
        <View>
          <Text variant="headlineMedium">
            Welcome {userDetail.name.givenName} {userDetail.name.familyName}!
          </Text>
        </View>
      </View>
      <View style={styles.innerContainer}>
        <Divider />
        <View>
          <Text variant="titleMedium">
            This is your dashboard page. You can see the progress you've made
            with your work and manage your projects or assigned tasks.
          </Text>
        </View>
      </View>
      <View style={styles.innerContainer}>
        <Text variant="headlineMedium">Project Stats</Text>
        <Divider />
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Project Id</DataTable.Title>
            <DataTable.Title numeric>Project Name</DataTable.Title>
            <DataTable.Title numeric>Project Description</DataTable.Title>
            <DataTable.Title numeric>Project Owner</DataTable.Title>
          </DataTable.Header>

          {stats &&
            stats.map(item => (
              <DataTable.Row key={item._id}>
                <DataTable.Cell>{item.projectId}</DataTable.Cell>
                <DataTable.Cell>{item.projectName}</DataTable.Cell>
                <DataTable.Cell>{item.projectDescription}</DataTable.Cell>
                <DataTable.Cell>{item.projectOwner}</DataTable.Cell>
              </DataTable.Row>
            ))}
        </DataTable>
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
    flexDirection: 'column',
    padding: 20,
  },
  appHeader: {
    backgroundColor: 'rgb(86, 156, 6)',
  },
  quoteIcon: {
    marginVertical: 8,
  },
});
