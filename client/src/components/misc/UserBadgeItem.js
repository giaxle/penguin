import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      varing={"solid"}
      fontSize={12}
      backgroundColor={"#9DECF9"}
      cursor={"pointer"}
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon ml={2} />
    </Box>
  );
};

export default UserBadgeItem;
