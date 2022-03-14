import { React, useState, useEffect } from "react";
import axios from "axios";
import {
  useToast,
  Box,
  Button,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import ChatLoading from "./misc/ChatLoading";
import { PenguinState } from "../Context/PenguinProvider";
import GroupModal from "./misc/GroupModal";
import { getSender } from "./logic/ChatLogic";
import SideDrawer from "./misc/SideDrawer";

const MyChats = ({ fetchAgain }) => {
  // const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState();
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = PenguinState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // const fetchNotifications = async () => {
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };

  //     const { data } = await axios.get("/api/message/notification", config);
  //     setNotification([data, ...notification]);
  //   } catch (error) {
  //     toast({
  //       title: "Error Occured!",
  //       description: "Failed to load notifications",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //   }
  // };

  useEffect(() => {
    // if (loggedUser === undefined) {
    //   setLoading(true);
    // }
    // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));

    fetchChats();
    setLoading(false);
  }, [fetchAgain]);
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "20px" }}
        fontWeight={"bold"}
        fontFamily={"Work sans"}
        d={"flex"}
        flexDirection={"column"}
        w={"100%"}
        justifyContent={"space-between"}
      >
        <Text fontSize={"28px"}>Penguin Chats</Text>
        <hr />
        <Text fontSize={"16px"} marginTop={3}>
          Find a person to chat or create a group chat
        </Text>
        <Box
          width={"100%"}
          display={"flex"}
          marginTop={3}
          gap={3}
          flexWrap={"wrap"}
        >
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button
              onClick={onOpen}
              marginBottom={3}
              width={"100%;"}
              maxWidth={"400px"}
            >
              <i className="fas fa-search"></i>
              <Text d={{ md: "flex" }} px={4} fontSize={"18px"}>
                Search User
              </Text>
            </Button>
          </Tooltip>
          <GroupModal onOpen={onOpen} />
        </Box>
      </Box>
      <Box
        d={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflow={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  bg={selectedChat === chat ? "#4299e1" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  cursor={"pointer"}
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      <SideDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
};

export default MyChats;
