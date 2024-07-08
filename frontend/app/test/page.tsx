"use client";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
      const newSocket = io(`ws://localhost:3000`,
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

export default function Home() {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);


  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('loaded', (data)=> {
        console.log(data)
      })
    }

  }, [socket]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div>
      {socket ? (
        <div>
          Socket connected: {socket.connected.toString()}
          <div>
            <input
              className='border border-black'
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          <div>
            <h2>Messages:</h2>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>Connecting...</div>
      )}
    </div>
  );
}