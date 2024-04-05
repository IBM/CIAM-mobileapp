import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, Dialog, Text} from 'react-native-paper';
import userService from '../../services/user-service';

export default function DeleteAccountDialog(props: any) {
  const navigation: any = useNavigation();
  const agreeDeletion = async () => {
    try {
      const response = await userService.deleteUser(props.token);
      navigation.navigate('Welcome');
      alert('Account deletion successful', response);
    } catch (error) {
      alert('Error while removing account permanently', error);
    }
  };
  return (
    <Dialog visible={props.visible} onDismiss={props.hideDialog}>
      <Dialog.Content>
        <Text variant="bodyMedium">
          Are you sure you want to delete the account permanently? Once deleted
          permanently cannot be recover.
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => props.hideDialog()}>Cancel</Button>
        <Button onPress={() => agreeDeletion()}>Agree</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
