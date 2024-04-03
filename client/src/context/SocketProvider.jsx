import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

// initially the cpntext is null 
const SocketContext = createContext(null);

// this is custom hook so we can useSocket whenever we wanted to use socket 
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};


export const SocketProvider = (props) => {
  const socket = useMemo(() => io("localhost:8000"), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
