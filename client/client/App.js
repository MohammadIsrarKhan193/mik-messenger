// client/App.js
import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from './src/screens/ChatScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [userId, setUserId] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} onLogin={(id) => setUserId(id)} />}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {(props) => <ChatScreen {...props} userId={userId} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
