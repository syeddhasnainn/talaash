import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors'
import fs from "fs";

const PORT = 3001
const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});
interface File {
  type: "file" | "dir";
  name: string;
}

const fetchDir = (dir: string, baseDir: string): Promise<File[]>  => {
  return new Promise((resolve, reject) => {
      fs.readdir(dir, { withFileTypes: true }, (err, files) => {
          if (err) {
              reject(err);
          } else {
              resolve(files.map(file => ({ type: file.isDirectory() ? "dir" : "file", name: file.name, path: `${baseDir}/${file.name}`  })));
          }
      });       
  });
}

app.get('/', (req, res)=> {
  res.send('ws server')
})

const html = `
'use client'
import React, { useState } from 'react';

const MyComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle sign-in logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div>
          <label>Test:</label>
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default MyComponent;

`

app.get('/update', (req, res) => {
  fs.writeFile('/Users/hasnain/Desktop/Projects/fe-test/app/component.tsx', html, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('File updated successfully');
      res.redirect('/');
    }
  })
})

io.on('connection', async(socket) => {
  console.log('A user connected');

  socket.emit("loaded", {
    rootContent: await fetchDir("/", "")
});

  socket.on('message', (msg) => {
    console.log('Message from user:', msg);
    io.emit('message', msg);

  });

  socket.on('generation', (msg)=> {
    io.emit('generation', msg)
    console.log(msg)
    if (msg !== null){
      fs.writeFile('/Users/hasnain/Desktop/Projects/fe-test/app/component.tsx', msg, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('File updated successfully');
        }
      })
    }
    else{
      console.log('Error generating component')
    }
    
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
