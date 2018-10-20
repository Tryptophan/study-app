import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';

const app = express();
const server = http.Server(app);

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