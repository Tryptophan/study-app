import express from 'express';
import bodyParser from 'body-parser';
import socketio from 'socket.io';
import http from 'http';
import mongo from './mongo';

mongo.connect((err) => {
  if (err) throw err;

  // Init REST and socket server
  const app = express();
  const server = http.Server(app);
  const io = socketio(server);

  // Client has connected to socket server
  io.on('connection', (socket) => {

    // Client joins chat room
    socket.on('join', (room) => {
      console.log('join', room);
      socket.join(room);
    });

    // Client sent chat message
    socket.on('chat', (chat) => {
      console.log(chat);

      // Add timestamp to chat
      chat.timestamp = Date.now();

      // Get all rooms socket is in
      for (let room in socket.rooms) {
        if (room !== socket.id) {
          // Insert chat into mongodb course collection
          mongo.getDb().collection('courses').findOneAndUpdate({ id: room }, {
            '$push': { chat: chat }
          }, { returnOriginal: false }, (err) => {
            if (err) throw err;
            // Send chat back to users in the course room
            io.to(room).emit('chat', chat);
          });
        }
      }
    });

  });

  // Body parser
  app.use(bodyParser.json());

  // CORS Requests
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // TODO: Log user in using blackboard credentials
  app.get('/login', (req, res) => {
    // TODO: Get username and password from request
    // TODO: Send token back to client for further requests
    res.status(500);
  });

  // Get courses for logged in user
  app.get('/courses', (req, res) => {
    // TODO: Get courses from blackboard with token
    res.json([
      {
        id: '123456',
        name: 'Advanced Algorithms',
      },
      {
        id: '123423y123',
        name: 'Databases'
      },
      {
        id: 'wqehqweqwe',
        name: 'Programming Languages'
      }
    ]);
  });

  // Listen on port
  server.listen(process.env.PORT, () => {
    console.log('Listening on http://localhost:%s', process.env.PORT);
  });
});