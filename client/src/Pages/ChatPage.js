import React, { useEffect, useState } from "react";
import axios from "axios";
import { PenguinState } from "../Context/PenguinProvider";
import { Box } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { user } = PenguinState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <NavBar />}
      <Box
        d={"flex"}
        justifyContent={"space-between"}
        height={"91.5vh"}
        p={"10px"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
