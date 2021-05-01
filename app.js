
// Declare Variables
const express = require('express');
const cors = require('cors');
const http = require('http');

const WebSocketServer = require('websocket').server;

const app = express();

const port = process.env.PORT || 3000;

//store list of connected clients
const clients = [];

//set up cors options
let corsOptions = {
    origin: "https://suspicious-nobel-3a5d20.netlify.app/",
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

wss.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    // Add new client to the client list
    clients.push(connection);
    connection.on('message', function(message) {
        let rec = JSON.parse(message.utf8Data);
        console.log(rec);
        if (rec.msg === "roll10") {
            rec.msg = rand_between(0,9);
            console.log(rec);
            let send = JSON.stringify(rec);
            console.log(send);
            //connection.send(send);

            clients.forEach(function each(client) {
                client.send(send);
            });
        }
        else if (rec.msg === "roll100") {
            rec.msg = rand_between(0,99);
            console.log(rec);
            let send = JSON.stringify(rec);
            connection.send(send);
        }
        else {
            //connection.send(message.utf8Data);
            clients.forEach(function each(client) {
                client.send(message.utf8Data);
            });
        }

    });
    connection.on('close', function (reasonCode, description) {
        let i = clients.indexOf(connection);
        clients.splice(i, 1);
        //let newc = clients.splice(i, 1);
        //clients = [...newc];
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
