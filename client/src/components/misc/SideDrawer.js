import React, { useState } from "react";
import axios from "axios";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Box,
  Input,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserListItem";
import { PenguinState } from "../../Context/PenguinProvider";

const SideDrawer = ({ isOpen, onOpen, onClose }) => {
  const { user, setSelectedChat, chats, setChats } = PenguinState();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  //   const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setResults(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((chat) => chat._id === data._id))
        setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth={"1px"}>
          Find a person to chat with:
        </DrawerHeader>
        <DrawerBody>
          <Box d={"flex"} pb={2}>
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            results?.map((user) => {
              return (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              );
            })
          )}
          {loadingChat && <Spinner ml={"auto"} d={"flex"} />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
