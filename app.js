
// Declare Variables
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//set up cors options
/*
let corsOptions = {
    //origin: "https://brave-hermann-d8bac0.netlify.app/",
    origin: "*",
    credentials: false,
}*/

//Run cors in nodejs app
// cors(corsoptions);
app.use(cors());

// body-parser middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/*io.on('connection', () => {
    console.log('a user is connected')
});*/

// Routes List
app.use('/', require('./routes/index'));
app.use('/posts', require('./routes/posts'));

// Add catch all else routes + redirect to /
app.get('/*', (req, res) => {
    res.send("Nope");
});

// Start Server
app.listen(port, () => {
    console.log(`listening on port ${port}!`);
});
