import React from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import LogoPenguin from "../components/penguins/LogoPenguin";

const Home = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d={"flex"}
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontSize={"4xl"} fontFamily={"Work sans"}>
          Penguin
        </Text>
        <LogoPenguin />
      </Box>
      <Box
        w={"100%"}
        p={"4"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        bg={"white"}
      >
        <Tabs variant="soft-rounded" colorScheme={"blue"}>
          <TabList mb={"1em"}>
            <Tab w={"50%"}>Login</Tab>
            <Tab w={"50%"}>Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
