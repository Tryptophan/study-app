import express from 'express';
import bodyParser from 'body-parser';
import socketio from 'socket.io';
import http from 'http';
import mongo from './mongo';

mongo.connect((err) => {
  if (err) throw err;

  const app = express();
  const server = http.Server(app);
  const io = socketio(server);

  // Client has connected to socket server
  io.on('connection', (socket) => {
    // Client sent chat message
    socket.on('chat', (chat) => {
      console.log(chat);
      // TODO: Insert chat into mongodb course collection
      // TODO: Send chat back to users in the course room
    });
  });

  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.get('/', (req, res) => {
    res.send('');
  });

  server.listen(process.env.PORT, () => {
    console.log('Listening on http://localhost:%s', process.env.PORT);
  });
});