import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import PenguinProvider from "./Context/PenguinProvider";

ReactDOM.render(
  <BrowserRouter>
    <PenguinProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </PenguinProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
