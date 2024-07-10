"use client";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useStore from "@/utils/store";

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        //input ws server url: in our case ws is running on port 3001
        const newSocket = io(`ws://localhost:3001`,
            {
                'transports': ['websocket'],
            }
        );
        setSocket(newSocket);

        return () => {
            newSocket.disconnect()
        };
    }, []);

    return socket;
}