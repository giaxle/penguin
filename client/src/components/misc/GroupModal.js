import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { PenguinState } from "../../Context/PenguinProvider";
import UserListItem from "../UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupModal = () => {
  const { user, chats, setChats } = PenguinState();
  const [loading, setLoading] = useState();
  const [groupName, setGroupName] = useState("");
  // const [search, setSearch] = useState();
  const [results, setResults] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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
        position: "bottom-left",
      });
    }
  };

  const handleAdd = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToRemove) => {
    // console.log(userToRemove);
    setSelectedUsers(selectedUsers.filter((user) => user !== userToRemove));
  };

  const handleSubmit = async () => {
    if (!groupName || !selectedUsers) {
      toast({
        title: "Fill in all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New group chat created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to create chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Button d={"flex"} onClick={onOpen} width={"100%"} maxWidth={"400px"}>
        <AddIcon marginRight={3} />
        <Text fontSize={"18px"}>Add Group Chat</Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"}>
            <FormControl>
              <Input
                mb={3}
                placeholder="Group chat name..."
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                mb={3}
                placeholder="Search users..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={"flex"} flexDir={"row"} flexWrap={"wrap"}>
              {selectedUsers.map((user) => {
                return (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                );
              })}
            </Box>
            <Box>
              {loading ? (
                <div>Loading...</div>
              ) : (
                results?.slice(0, 4).map((user) => {
                  return (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAdd(user)}
                    />
                  );
                })
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupModal;
