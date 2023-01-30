import React from 'react';

import ChatList from '../../components/ChatList';

const Chat = () => {
    const chatMessages = [];

    return <ChatList messages={chatMessages}></ChatList>;
};

export default Chat;
