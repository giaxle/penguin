import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const { data } = await axios.get("/api/chats");
    console.log(data);
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      <div>ChatPage</div>
      <div>
        {chats.map((chat) => (
          <div key={chat._id}>{chat.chatName}</div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;