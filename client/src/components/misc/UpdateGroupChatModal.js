import React, { useState } from "react";
import axios from "axios";
import { PenguinState } from "../../Context/PenguinProvider";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  IconButton,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "../UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = PenguinState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [newGroupName, setNewGroupName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRenameGroup = async () => {
    if (!newGroupName) {
      return;
    }

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: newGroupName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Failed to rename chat!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }
    setNewGroupName("");
  };

  const handleSearch = async (query) => {
    // setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setResults(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occurred!",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((user) => user._id === userToAdd._id)) {
      toast({
        title: "User already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error has occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setNewGroupName("");
  };

  const handleRemoveUser = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast({
        title: "Only admins can remove someone",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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

      const { data } = await axios.put(
        "api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error has occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setNewGroupName("");
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<ViewIcon />}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <Text marginBottom={3} marginLeft={6}>
            Admin: {selectedChat.groupAdmin.name}
          </Text>
          <ModalCloseButton />
          <hr />
          <ModalBody>
            {/* <Text>Edit Group Chat</Text> */}
            <FormControl display={"flex"} flexDir={"row"} mb={3}>
              <Input
                placeholder="New group name..."
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Button marginLeft={2} type="submit" onClick={handleRenameGroup}>
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                mb={3}
                placeholder="Search users..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={"flex"} flexDir={"row"} flexWrap={"wrap"}>
              {selectedChat.users.map((user) => {
                return (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleRemoveUser(user)}
                  />
                );
              })}
            </Box>
            <Box>
              {loading ? (
                <Spinner size={"lg"} />
              ) : (
                results?.slice(0, 4).map((user) => {
                  return (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  );
                })
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleRemoveUser(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
