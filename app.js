const express = require('express');
const session = require('express-session');
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);
const querystring = require('querystring');
var bodyParser = require('body-parser');



const app = express();

app.use(bodyParser.urlencoded({extended: true}));

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
  });

// Start a session; we use Redis for the session store.
// "secret" will be used to create the session ID hash (the cookie id and the redis key value)
// "name" will show up as your cookie name in the browser
// "cookie" is provided by default; you can add it to add additional personalized options
// The "store" ttl is the expiration time for each Redis session ID, in seconds
app.use(session({
    secret: 'ThisIsHowYouUseRedisSessionStorage',
    name: '_redisSession',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
    store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 }),
  }));


app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + '/static'));

const server = app.listen(8888, () => {console.log("app listening at port 8888");});

/* Routes */
const TeacherViewRoutes = require('./routes/view.teacher.routes')
const StudentViewRoutes = require('./routes/view.student.routes')
app.use('/teacher', TeacherViewRoutes);
app.use('/', StudentViewRoutes);

// require('./controllers/SocketController');

const io = require("socket.io")(server);
require('./controllers/SocketController').socket(io);




