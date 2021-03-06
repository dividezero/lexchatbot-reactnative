/**
 * Created by hazlan on 19/7/2017.
 */
import React from 'react';
import {
    Text,
    TextInput,
    KeyboardAvoidingView,
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableHighlight
} from 'react-native';
import appConfig from '../../../config';

class ChatScreen extends React.Component {

    constructor(props) {
        super(props);

        this.sendMessage = this.sendMessage.bind(this);
        this.state = {
            text: null,
            messages: [{
                message: appConfig.bot.initMessage,
                datetime: new Date().toLocaleString()
            }]
        };

    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.nav}/>
                <Header title={appConfig.bot.name}/>
                <ScrollView>
                    <View style={styles.messageArea}>
                        {
                            this.state.messages.map((obj, key) => {
                                console.log(this.state.messages);
                                if (obj.userMessage) {
                                    return <UserMessage message={obj.message} datetime={obj.datetime} key={key}/>
                                } else {
                                    return <BotMessage message={obj.message} datetime={obj.datetime} key={key}/>
                                }
                            })
                        }
                    </View>
                </ScrollView>
                <TextInput
                    style={styles.chatInput}
                    placeholder={'Say something..'}
                    blurOnSubmit={false}
                    onChangeText={(text) => {
                        let state = this.state;
                        state.text = text;
                        this.setState(state);
                    }}
                    value={this.state.text}
                    onSubmitEditing={(event) => {
                        if (this.state.text) {
                            console.log('send message', this.state.text)
                            this.updateMessages({
                                userMessage: true,
                                message: this.state.text,
                                datetime: new Date().toLocaleString()
                            });
                            this.sendMessage(this.state.text);

                            let state = this.state;
                            state.text = "";
                            this.setState(state);
                        }
                    }}
                />
            </KeyboardAvoidingView>
        );
    }

    sendMessage = (message) => {
        let AWS = require('aws-sdk/dist/aws-sdk-react-native');

        AWS.config.credentials = {
            "accessKeyId": appConfig.accessKeyId,
            "secretAccessKey": appConfig.secretAccessKey,
            "region": appConfig.region
        };
        AWS.config.update({region: 'us-east-1'});

        let lexruntime = new AWS.LexRuntime({
            apiVersion: appConfig.apiVersion,
        });

        let params = {
            botAlias: appConfig.botAlias, /* required */
            botName: appConfig.botName, /* required */
            inputText: message, /* required */
            userId: appConfig.userId, /* required */
            sessionAttributes: {
                someKey: 'STRING_VALUE',
                /* anotherKey: ... */
            }
        };

        lexruntime.postText(params, (err, data) => {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                if (data.dialogState === "ReadyForFulfillment") {
                    data.message = appConfig.bot.completeMessage;
                }

                data.datetime = new Date().toLocaleString();
                this.updateMessages(data);
            }
        });
    }

    updateMessages = (message) => {
        let state = this.state;
        state.messages = state.messages.concat(message);
        this.setState(state);
    }
}

const BotMessage = ({message, datetime}) => {
    return (
        <View style={styles.botMessage}>
            <View style={styles.botMessageBubble}>
                <Text style={styles.botMessageText}>{message}</Text>
                <Text style={styles.datetimeText}>{datetime}</Text>
            </View>
        </View>
    );
};

const UserMessage = ({message, datetime}) => {
    return (
        <View style={styles.userMessage}>
            <View style={styles.userMessageBubble}>
                <Text style={styles.userMessageText}>{message}</Text>
                <Text style={styles.datetimeText}>{datetime}</Text>
            </View>
        </View>
    );
};

const Header = ({title, leftOnPress, rightOnPress}) => {
    return (
        <View style={{
            flexDirection: 'row',
            padding: 10,
            justifyContent: "space-between",
            backgroundColor: appConfig.theme.header.bgColor
        }}>
            <View style={{
                flex: 0.2,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <TouchableHighlight
                    onPress={() => {
                        leftOnPress();
                    }}
                    underlayColor='#000000'>
                    <View
                        style={{
                            padding: 20
                        }}>

                    </View>
                </TouchableHighlight>
            </View>
            <View style={{
                flex: 0.8,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{
                    backgroundColor: 'transparent',
                    textAlign: 'center',
                    color: appConfig.theme.header.textColor,
                    fontSize: 20
                }}>{title}</Text>
            </View>
            <View style={{
                flex: 0.2,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TouchableHighlight
                    onPress={() => {
                        rightOnPress();
                    }}
                    underlayColor='#000000'
                    style={{flex: 0.1}}>
                    <View
                        style={{
                            padding: 20
                        }}>

                    </View>
                </TouchableHighlight>
            </View>
        </View>
    );
};

const chatWidth = Dimensions.get('window').width * 0.7;
const styles = StyleSheet.create({
    nav: {
        height: 21,
        backgroundColor: 'black'
    },
    container: {
        flex: 1
    },
    messageArea: {
        flex: 1,
        padding: 10,
    },
    botMessage: {
        flex: 1,
        paddingBottom: 8
    },
    botMessageBubble: {
        width: chatWidth,
        padding: 15,
        backgroundColor: appConfig.theme.message.botMsgBgColor,
        borderRadius: 12
    },
    botMessageText: {
        color: appConfig.theme.message.botMsgTextColor
    },
    userMessageText: {
        color: appConfig.theme.message.userMsgTextColor
    },
    datetimeText: {
        fontSize: 11,
        color: appConfig.theme.message.dateTextColor,
        opacity: 0.8,
        textAlign: 'right',
        paddingTop: 5
    },
    userMessage: {
        flex: 1,
        alignItems: 'flex-end',
        paddingBottom: 8
    },
    userMessageBubble: {
        width: chatWidth,
        padding: 15,
        backgroundColor: appConfig.theme.message.userMsgBgColor,
        borderRadius: 12,
    },
    chatInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10
    }
});


export default ChatScreen;