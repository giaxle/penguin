import { React } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { PenguinState } from "../Context/PenguinProvider";
import LogoPenguin from "./penguins/LogoPenguin";
import ProfileModal from "./misc/ProfileModal";
import NotificationBadge, { Effect } from "react-notification-badge";
import { getSender } from "./logic/ChatLogic";

const NavBar = () => {
  const { user, setUser, notification, setNotification, setSelectedChat } =
    PenguinState();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser("");
    navigate("/");
  };

  return (
    <div>
      <Box
        d={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <div style={{ display: "flex" }}>
          <Text fontSize={"4xl"} fontFamily={"Work sans"} paddingLeft={2}>
            Penguin
          </Text>
          <LogoPenguin />
        </div>
        <div>
          <Menu>
            <MenuButton p={"1"}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList>
              {!notification.length ? (
                <div>No New Messages</div>
              ) : (
                notification.map((notif) => {
                  return (
                    <MenuItem
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter(
                            (n) => n.chat._id !== notif.chat._id
                          )
                        );
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New message in ${notif.chat.chatName}`
                        : `New message from ${getSender(
                            user,
                            notif.chat.users
                          )}`}
                    </MenuItem>
                  );
                })
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              backgroundColor={"white"}
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </div>
  );
};

export default NavBar;
