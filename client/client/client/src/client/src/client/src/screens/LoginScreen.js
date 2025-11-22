// client/src/screens/LoginScreen.js
import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, Text, View } from 'react-native';

export default function LoginScreen({ navigation, onLogin }) {
  const [id, setId] = useState('');

  return (
    <SafeAreaView style={{flex:1, padding:20}}>
      <Text style={{fontSize:22, marginBottom:12}}>MÎK Messenger — Sign in</Text>
      <TextInput
        placeholder="Enter userId (eg: israr)"
        value={id}
        onChangeText={setId}
        style={{borderWidth:1, padding:8, marginBottom:12}}
      />
      <Button title="Sign in" onPress={() => {
        if (!id) return alert('Enter userId');
        onLogin(id);
        navigation.navigate('Chat');
      }} />
    </SafeAreaView>
  );
}
