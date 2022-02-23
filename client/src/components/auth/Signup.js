import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pic, setPic] = useState(
    "https://res.cloudinary.com/djectxrjs/image/upload/v1645575120/egceykxq2xzvjgzsj5di.png"
  );
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // const postDetails = (pics) => {
  //   setLoading(true);
  //   if (pics === undefined) {
  //     toast({
  //       title: "Please select an image!",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     setLoading(false);
  //     return;
  //   }

  //   if (pics.type === "image/jpeg" || pics.type === "image/png") {
  //     console.log(pics);
  //     const data = new FormData();
  //     data.append("file", pics);
  //     data.append("upload_preset", "Penguin");
  //     data.append("cloud_name", "djectxrjs");
  //     fetch(process.env.REACT_APP_CLOUDINARY, {
  //       method: "post",
  //       body: data,
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);
  //         setPic(data.url.toString());
  //         console.log(data.url.toString());
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setLoading(false);
  //       });
  //   } else {
  //     toast({
  //       title: "Please select an image!",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmation) {
      toast({
        title: "Fill in all fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmation) {
      toast({
        title: "Your passwords don't match! Dumb penguin...",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/register",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      toast({
        title: "Registration successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (err) {
      toast({
        title: "Error has occurred!",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl>
        <FormLabel fontWeight={"bold"}>Name</FormLabel>
        <Input
          placeholder="Pick a good name!"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormControl>
      <FormControl>
        <FormLabel fontWeight={"bold"}>Email</FormLabel>
        <Input
          placeholder="Do penguins have emails?"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormControl>
      <FormControl>
        <FormLabel fontWeight={"bold"}>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Ooo password..."
            onChange={(e) => setPassword(e.target.value)}
            required
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
      <FormControl>
        <FormLabel fontWeight={"bold"}>Password Confirmation</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Ooo password..."
            onChange={(e) => setConfirmation(e.target.value)}
            required
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
      {/* <FormControl>
        <FormLabel fontWeight={"bold"}>Upload a picture!</FormLabel>
        <Input
          type={"file"}
          p={1.5}
          border={"none"}
          accept={"image/"}
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl> */}
      <Button
        colorScheme={"blue"}
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign up
      </Button>
    </VStack>
  );
};

export default Signup;
