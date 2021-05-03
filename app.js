
// Declare Variables
const express = require('express');
const cors = require('cors');
const http = require('http');

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getAllUsers,
    getAllUserNames
} = require('./utils/users');

const WebSocketServer = require('websocket').server;

const app = express();

const port = process.env.PORT || 3000;

//store list of connected clients
//const clients = [];

//set up cors options
let corsOptions = {
    origin: "https://suspicious-nobel-3a5d20.netlify.app/",
    //origin: "http://localhost:8080",
    credentials: true,
}

//Run cors in nodejs app
// cors(corsoptions);
app.use(cors(corsOptions));

// body-parser middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//
// We need the same instance of the session parser in express and
// WebSocket server.
//

// Routes List
app.use('/', require('./routes/index'));

//
// Create an HTTP server.
//
const server = http.createServer(app);

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new WebSocketServer({
    httpServer: server
});

function rand_between(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function message(name, type, msg, time) {
    let res = {
        name: name,
        msg: msg,
        type: type,
        time: time
    }

    switch (msg) {
        case "roll10":
            res.msg = rand_between(0, 9);

            break;
        
        case "roll100":
            res.msg = rand_between(0, 99);

            break;
    }

    let send = JSON.stringify(res);

    let clients = getAllUsers();
    console.log(clients.length);

    clients.forEach(function each(user) {
        user.connection.send(send);
    });
}

function check_type(connection, req) {
    console.log(req);
    switch(req.type) {
        case "open":
          // Add user and name to userlist
            console.log("Open request");
            userJoin(connection, req.name);
            let usernames = getAllUserNames();
            console.log(usernames);
            message(req.name, req.type, usernames, req.time);
          break;
        
        case "message":
          // Work out message logic and broadcast
            console.log("Message Request");
            message(req.name, req.type, req.msg, req.time);
          break;

        case "close":
          // remove 
            console.log("Close request");
          break;

        default:
          console.log("No type found, ignoring.")            
      }
}

wss.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
        let rec = JSON.parse(message.utf8Data);
        // console.log(rec);
        check_type(connection, rec);
    });

    connection.on('close', function (reasonCode, description) {
        //let clients = 
        userLeave(connection);

        //Re-post client list to users
        console.log('Client has disconnected.');
    });
});

// End example bit
//

// Add catch all else routes + redirect to /
/*
app.get('/*', (req, res) => {
    res.send("Nope");
});
*/

// Start Server
server.listen(port, () => {
    console.log(`listening on port ${port}!`);
});
