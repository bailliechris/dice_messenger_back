
// Declare Variables
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Should be in /posts ? - swap app for router
const server = require('http').Server(app);
const io = require('socket.io')(server);

// On Connection Method - Socket.io
io.on('connection', (socket) => {
    socket.send("Hello!");

    socket.on('chatMessage', (msg) => {
        console.log(msg);
        io.emit('chatMessage', msg);
    });
  });

//set up cors options
let corsOptions = {
    origin: "http://localhost:8080",
    credentials: true,
}

//Run cors in nodejs app
// cors(corsoptions);
app.use(cors(corsOptions));

// body-parser middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes List
app.use('/', require('./routes/index'));
app.use('/posts', require('./routes/posts'));

// Add catch all else routes + redirect to /
app.get('/*', (req, res) => {
    res.send("Nope");
});

// Start Server
server.listen(port, () => {
    console.log(`listening on port ${port}!`);
});