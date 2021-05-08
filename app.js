
// Declare Variables
const express = require('express');
const cors = require('cors');
const http = require('http');

// Functions to manage user connections
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getAllUsers,
    getAllUserNames
} = require('./utils/users');

// Rolling dice functions
const {
    roll_dice,
    rand_between
} = require('./utils/math-parse');

// Create new WSS
const WebSocketServer = require('websocket').server;

// Set up express
const app = express();
const port = process.env.PORT || 3000;

//set up cors options
let corsOptions = {
    origin: "https://suspicious-nobel-3a5d20.netlify.app/",
    //origin: "http://localhost:8080",
    credentials: true,
}

//Run cors in nodejs app
app.use(cors(corsOptions));

// body-parser middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

// Decide how to deal with an incoming 'message' event
function message(name, type, msg, time) {
    // Find a better solution - using this about 50% of the time - not efficient.
    let clients = getAllUsers();

    if (msg[0] === "!") {
        message_handler(null, name, type, roll_dice(msg.slice(1)), time);
    } else {
        switch (msg) {
            // Roll a D10 and send to all
            case "roll":
                message_handler(null, name, type, rand_between(0, 9), time);
                break;
            
            // User types help - respond with command list
            case "help":
                const con = clients.find(client => client.name === name);
                message_handler(con.connection,
                    name,
                    type,
                    "To roll try: !2d6+3 or !d100 or !5d10",
                    time);
                break;
            // Standard - deal with messages
            default:
                // If only 1 user, respond with help text
                if (clients.length < 2) {
                    const con = clients.find(client => client.name === name);
                    message_handler(con.connection,
                        "helpbot",
                        type,
                        "Just so you know, you're talking to yourself.",
                        time);
                    // Handle other messages
                } else {
                    message_handler(null, name, type, msg, time);
                }
        }
    }
}

// Message Handler
// Send a connection in the first parameter to send to a single user
function message_handler(connection, name, type, msg, time) {
    let res = {
        name: name,
        msg: msg,
        type: type,
        time: time
    }
    
    let send = JSON.stringify(res);
    let clients = getAllUsers();

    if (connection === null) {
        
        clients.forEach(function each(user) {
            user.connection.send(send);
        });
    } else {
        connection.send(send);
    }
}

// Check type of 'message' event -
// open - New user connected, sending a name to add to attach to the user list
// Responds with all current connected users to all users to update user list
// message - deal with as a message (see message function)
// close - not needed could be removed ?
// nothing - record error as consolelog
function check_type(connection, req) {
    console.log(req);
    switch(req.type) {
        case "open":
          // Add user and name to userlist
            console.log("Open request");
            userJoin(connection, req.name);
            let usernames = getAllUserNames();
            console.log(usernames);
            message_handler(null, req.name, req.type, usernames, req.time);
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

// If a client connects
wss.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
        let rec = JSON.parse(message.utf8Data);
        // console.log(rec);
        check_type(connection, rec);
    });

    // On close of client, capture connection and remove from client list
    // Send updated client list to users
    connection.on('close', function (reasonCode, description) {
        //let clients = 
        userLeave(connection);
        let usernames = getAllUserNames();
        //console.log(usernames);
        message_handler(null, "", "open", usernames, "");
        //Re-post client list to users
        console.log('Client has disconnected.');
    });
});

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
