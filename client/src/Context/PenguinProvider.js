import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PenguinContext = createContext();

const PenguinProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setUser(userInfo);
    } else {
      navigate("/");
    }
  }, [navigate]);
  return (
    <PenguinContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </PenguinContext.Provider>
  );
};

export const PenguinState = () => {
  return useContext(PenguinContext);
};

export default PenguinProvider;
