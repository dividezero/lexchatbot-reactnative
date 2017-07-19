import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ChatScreen from './app/components/chat/ChatScreen';

export default class App extends React.Component {
    render() {

        return (
            <ChatScreen></ChatScreen>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
