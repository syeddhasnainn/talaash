import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors'
import fs from "fs";

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
  res.sendFile(__dirname+'/index.html')
})

const html = `

<button class="signin-btn" type="submit">Sign In</button>

`

app.get('/update', (req, res) => {
  fs.writeFile(__dirname+'/index.html', html, (err) => {
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

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
