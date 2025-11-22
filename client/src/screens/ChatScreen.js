// client/src/screens/ChatScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, View, TextInput, Button, FlatList, Text } from 'react-native';
import WSClient from '../ws';
import { saveMessage, loadMessages } from '../messageHandler';

const WS_URL = 'ws://YOUR_SERVER_HOST:8080'; // replace with your server URL

export default function ChatScreen({ userId }) {
  const [toId, setToId] = useState('');
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    const ws = new WSClient(WS_URL);
    wsRef.current = ws;
    ws.onOpen = () => console.log('ws open');
    ws.onMessage = async (data) => {
      if (data.type === 'message') {
        setMsgs((m) => [...m, { from: data.from, body: data.body, ts: data.ts }]);
        await saveMessage(data.from, { from: data.from, body: data.body, ts: data.ts });
      }
    };
    ws.connect(userId);

    // load stored messages for default chat (if user opens with toId later)
    (async () => {
      const stored = await loadMessages(toId || userId);
      setMsgs(stored || []);
    })();

    return () => ws.close();
  }, [userId]);

  const send = async () => {
    if (!toId || !text) return alert('set recipient and text');
    const body = text;
    const msg = { type: 'message', to: toId, body, ts: Date.now() };
    wsRef.current.send(msg);
    setMsgs((m) => [...m, { from: userId, body, ts: msg.ts }]);
    await saveMessage(toId, { from: userId, body, ts: msg.ts });
    setText('');
  };

  return (
    <SafeAreaView style={{flex:1, padding:12}}>
      <View style={{flexDirection:'row', marginBottom:8}}>
        <TextInput placeholder="To (userId)" value={toId} onChangeText={setToId}
          style={{flex:1, borderWidth:1, padding:8, marginRight:8}} />
      </View>

      <FlatList
        data={msgs}
        keyExtractor={(item, i) => String(i)}
        renderItem={({item}) => (
          <View style={{padding:8, marginVertical:4, backgroundColor: item.from === userId ? '#DCF8C6' : '#fff' }}>
            <Text>{item.from}: {item.body}</Text>
            <Text style={{fontSize:10, color:'#555'}}>{new Date(item.ts).toLocaleString()}</Text>
          </View>
        )}
      />

      <View style={{flexDirection:'row', alignItems:'center', marginTop:8}}>
        <TextInput placeholder="Type a message" value={text} onChangeText={setText}
          style={{flex:1, borderWidth:1, padding:8, marginRight:8}} />
        <Button title="Send" onPress={send} />
      </View>
    </SafeAreaView>
  );
}
