import React from "react";
import axios from "axios";
import { PenguinState } from "../Context/PenguinProvider";
import { Box, Text } from "@chakra-ui/react";
import Chat from "./Chat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = PenguinState();
  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Chat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
