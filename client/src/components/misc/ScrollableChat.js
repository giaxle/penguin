import React from "react";
import { PenguinState } from "../../Context/PenguinProvider";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../logic/ChatLogic";
import { Box, Text, Tooltip, Avatar } from "@chakra-ui/react";

const ScrollableChat = ({ allMessages }) => {
  const { user } = PenguinState();
  return (
    <ScrollableFeed>
      {allMessages.map((m, i) => {
        return (
          <div
            style={{
              display: "flex",
              marginBottom: "5px",
              alignItems: `${m.sender._id === user._id ? "right" : "left"}`,
            }}
            key={m._id}
          >
            {(isSameSender(allMessages, m, i, user._id) ||
              isLastMessage(allMessages, i, user._id)) && (
              <Tooltip
                label={m.sender.name}
                placement={"bottom-start"}
                hasArrow
              >
                <Avatar
                  marginTop={1}
                  marginRight={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(allMessages, m, i, user._id),
                marginTop: isSameUser(allMessages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
