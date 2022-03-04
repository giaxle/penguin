import React from "react";
import { Stack, Skeleton } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <div>
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    </div>
  );
};

export default ChatLoading;
