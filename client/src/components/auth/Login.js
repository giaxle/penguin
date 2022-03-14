import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  // const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast({
        title: "Fill in all fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      // setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        config
      );
      toast({
        title: "Login successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      // setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error has occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      // setLoading(false);
    }
  };

  return (
    <VStack>
      <FormControl>
        <FormLabel fontWeight={"bold"}>Email</FormLabel>
        <Input
          value={email}
          placeholder="Do penguins have emails?"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel fontWeight={"bold"}>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Ooo password..."
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement w={"4.5rem"}>
            <Button
              h={"1.75rem"}
              size={"sm"}
              onClick={() => {
                setShow(!show);
              }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme={"blue"}
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
      >
        Login
      </Button>
      <Button
        colorScheme={"red"}
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Guest
      </Button>
    </VStack>
  );
};

export default Login;
