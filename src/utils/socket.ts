import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { log,consoleError } from "./logger";

const useSocket = (baseURL: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(baseURL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
    });
    setSocket(socketInstance);

    socketInstance.on("connect", () => log("Connected to the server"));
    socketInstance.on("disconnect", () =>
      log("Disconnected from the server")
    );
    socketInstance.on("connect_error", (error) =>
      consoleError("Connection error:", error)
    );

    return () => {
      // Clean up event listeners
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");
      socketInstance.disconnect();
    };
  }, [baseURL]);

  return socket;
};

export default useSocket;
