const appConfig = {
    "accessKeyId": "",
    "secretAccessKey": "",
    "region": "us-east-1",
    "apiVersion": "2016-11-28",
    "botAlias": "",
    "botName": "",
    "userId": "",
    bot: {
        name: "IT Bot 🤖",
        initMessage: "Hi, I'm the IT Bot. How can I help you today?",
        completeMessage: "Well too bad! Anything else I can help you with?"
    },
    theme: {
        header:{
            bgColor: "black",
            textColor: "white",
        },
        message:{
            botMsgBgColor: "steelblue",
            botMsgTextColor: "white",
            userMsgBgColor: "green",
            userMsgTextColor: "white",
            dateTextColor: "white" //auto opacity 0.8
        }
    }
};
export default appConfig;