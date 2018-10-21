import express from 'express';
import bodyParser from 'body-parser';
import socketio from 'socket.io';
import http from 'http';
import mongo from './mongo';
import axios from 'axios';

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

      if (!chat.message.length) {
        return;
      }

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

  app.post('/audio', (req, res) => {
    let token = process.env.REV_SPEECH_API
    console.log(token);
    console.log(req.data);
    axios({
      method: 'post',
      url: 'https://api.rev.ai/revspeech/v1beta/jobs',
      data: req.data,
      config: {
        headers: {
          'Access-Control-Allow-Headers': 'Authorization',
          'Authorization': 'Bearer $[token]', 'Content-Type': 'multipart/form-data'
        }
      }
    })
      .then(function (response) {
        //handle success
        console.log(response.data);
      })
      .catch(function (err) {
        //handle error
        console.log(err.message);
      });

    // req.headers
    // // Make axios post to jobs enpoint
    // let headers = {
    //   'Content-Type': 'multipart/form-data',
    //   'Authorization': 'Bearer ' + audioToken
    // };
    // req.headers = { ...req.headers, ...headers };
    // axios.post(req)
    //   .then(() => {
    //     res.sendStatus(200);
    //   }).catch(() => {
    //     res.sendStatus(500);
    //   });
  });

  // TODO: Log user in using blackboard credentials
  app.post('/login', (req, res) => {

    let token = ''; //GET TOKEN TODO

    axios.get('https://canvas.instructure.com/api/v1/courses?include[]=term', {
      params: {
        access_token: token,
      }
    }).then((response) => {
      let data = response.data;
      
      let courses = [];
      let course_ids = [];

      data.forEach((course) => { 
        courses.push({
          id: course.id,
          name: course.name,
          term: course.term.name
        });
        course_ids.push(course.id);
      });

      courses.forEach((course) => {
        mongo.getDb().collection('courses').findOneAndUpdate({'id': course.id}, {"$set": {'id': course.id, 'name': course.name, 'term': course.term}}, {upsert: true});
      });

      axios.get('https://canvas.instructure.com/api/v1/users/self/profile', {
        params: {
          access_token: token,
        }
      }).then((response) => {
        let data = response.data;

        let user = {
          'id': '' + data.id,
          'name': data.name,
          'email': data.primary_email,
          'courses': course_ids
        };

        mongo.getDb().collection('users').findOneAndUpdate({'id': user.id}, {"$set": {'name': user.name, 'email': user.email, 'courses': user.courses}}, {upsert: true});

        res.json(user);
      });
    });
  });

  // Get courses for logged in user
  app.get('/courses', (req, res) => {
    // TODO: Get courses from blackboard with token

    req.

    mongo.getDb().collection('users').findOne({'id': user_id}, (err, response) => {
      let courses = [];

      Promise.all(
      response.courses.map((course) => {
        return new Promise((resolve, reject) => {
          mongo.getDb().collection('courses').findOne({'id': course}, (err, response) => {
            if (err) return reject(err);
            resolve(response);
          });  
        });
      })).then((courses) => {
        res.json(courses);
      }).catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
    });
  });
  //   res.json([
  //     {
  //       id: '123456',
  //       name: 'Advanced Algorithms',
  //     },
  //     {
  //       id: '123423y123',
  //       name: 'Databases'
  //     },
  //     {
  //       id: 'wqehqweqwe',
  //       name: 'Programming Languages'
  //     }
  //   ]);

  // Listen on port
  server.listen(process.env.PORT, () => {
    console.log('Listening on http://localhost:%s', process.env.PORT);
  });
});