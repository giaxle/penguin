import React, { useState, useEffect } from "react";
import axios from "axios";
import { PenguinState } from "../Context/PenguinProvider";
import {
  Box,
  FormControl,
  IconButton,
  Spinner,
  Text,
  useToast,
  Input,
  Button,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./logic/ChatLogic";
import ProfileModal from "./misc/ProfileModal";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal";
import ScrollableChat from "./misc/ScrollableChat";
import io from "socket.io-client";
// import Lottie from "react-lottie";

const ENDPOINT = "https://mern-penguin.herokuapp.com/";

// http://localhost:3000/

// https://mern-penguin.herokuapp.com/

let socket, selectedChatCompare;

const Chat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    PenguinState();
  const toast = useToast();

  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setAllMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (
      (e.key === "Enter" && newMessage) ||
      (e.type === "click" && newMessage)
    ) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        // sendNotification(newMessage, selectedChat, config);

        console.log(data);

        socket.emit("new message", data);
        socket.emit("stop typing", selectedChat._id);
        setNewMessage("");
        setAllMessages([...allMessages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // const sendNotification = async (newMessage, selectedChat, config) => {
  //   try {
  //     const { data } = await axios.post(
  //       "/api/message/notification",
  //       { content: newMessage, chatId: selectedChat._id },
  //       config
  //     );

  //     console.log(data);
  //   } catch (error) {
  //     console.log("couldnt send notification");
  //   }
  // };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("not typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("not typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification

        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setAllMessages([...allMessages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              marginRight={3}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#e8e8e8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                alignSelf={"center"}
                w={20}
                h={20}
                margin={"auto"}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat allMessages={allMessages} />
              </div>
            )}
            <FormControl
              display={"flex"}
              flexDir={"column"}
              onKeyDown={sendMessage}
              isRequired
              marginTop={3}
            >
              {isTyping ? <div>Someone is typing...</div> : <></>}
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Input
                  variant={"filled"}
                  bg={"#CBD5E0"}
                  placeholder="Enter message here..."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <Button
                  colorScheme={"blue"}
                  marginLeft={3}
                  onClick={(e) => sendMessage(e)}
                >
                  Send
                </Button>
              </div>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          d={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={6} fontFamily={"Work sans"}>
            Click on a chat to start chatting!
          </Text>
        </Box>
      )}
    </>
  );
};

export default Chat;
