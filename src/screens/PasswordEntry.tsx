import React, { useState } from 'react'
import { PasswordEntryProps } from '../utils/types'
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

const PasswordEntry: React.FC<PasswordEntryProps> = ({ route, navigation }) => {
  const { note } = route.params;
  const [enteredPassword, setEnteredPassword] = useState('');
  const handleUnlock = () => {
    if(enteredPassword === note.password) navigation.navigate('Note', { note });
    else Alert.alert('Incorrect password, please try again');
  }
  return (
    <View style={styles.container}>
      <TextInput secureTextEntry placeholder='Enter Password' value={enteredPassword} onChangeText={setEnteredPassword} style={styles.input} />
      <Button title='Unlock Note' onPress={handleUnlock} />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  }
})

export default PasswordEntry;