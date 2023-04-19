import React, {useState, useEffect} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import axios from 'axios';
import {OPEN_API_KEY} from './API_KEY';

function App(): JSX.Element {
  const API_KEY = OPEN_API_KEY;
  const CHATGPT_ENDPOINT =
    'https://api.openai.com/v1/engines/davinci/completions';


  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowText(false);
    }, 5000);
  }, [showText]);

  const handleSend = async (newMessages = []) => {
    // console.log('newMessages', newMessages[0]);
    const text = newMessages[0]?.text?.trim();
    setText(text);
    setShowText(true);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    };

    const data = {
      prompt: text,
      max_tokens: 1024,
      n: 1,
      stop: '\n',
      temperature: 0.5,
    };
    await axios
      .post(CHATGPT_ENDPOINT, data, {headers})
      .then(response => {
        console.log('response', response?.data?.choices[0], text);
        const chatGptMessage = response?.data?.choices[0]?.text;
        const botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: chatGptMessage,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'ChatGPT Bot',
            avatar: 'https://placeimg.com/140/140/any',
          },
        };
        setMessages(GiftedChat.append(messages, botMessage));
      })
      .catch(error => {
        console.log('error', error, text);
        const errTxt = {
          _id: Math.random().toString(36).substring(7),
          text: `Something went wrong for "${text}"`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'ChatGPT Bot',
            avatar: 'https://dummyimage.com/64x64/000/fff&text=Not+found',
          },
        };
        setMessages(GiftedChat.append(messages, errTxt));
      });
  };

  const showYourText = () => {
    return (
      showText && (
        <View style={{borderBottomColor: '#EAEBE8', borderBottomWidth: 0.5}}>
          <Text style={{alignSelf: 'flex-end', padding: 10}}>{text}</Text>
        </View>
      )
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {showYourText()}
      <GiftedChat
        // messagesContainerStyle={{backgroundColor: '#EAEBE8'}}
        messages={messages}
        onSend={handleSend}
        user={{
          _id: 1,
          name: 'User',
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
