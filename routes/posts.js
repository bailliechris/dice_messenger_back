const express = require('express');
const router = express.Router();


// Load Post models
//const Post = require('../models/post');

// Post Variable Store posts whilst server is active - replace with DB?
var all_posts = [];

// Random Number Function
function rand_between(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function convert_time() {
    var time = new Date().getTime(); 
    var date = new Date(time); 
 
    return date.toString(); 
}

// Create a post
router.post('/add', (req, res) => {
    // Create post and saving
    if (req.body.msg == "roll") {
        var new_post = {
            name: "Dice Bot",
            msg: req.body.name + " rolled " + rand_between(0, 100),
            time: convert_time()
        };
    }
    else {
        var new_post = {
            name: req.body.name,
            msg: req.body.msg,
            time: convert_time()
        };
    }
    
    all_posts.push(new_post);

//    io.emit('all_posts', all_posts);
    res.send(all_posts);
});

// Return All
router.get('/', (req, res) => {
    res.send(all_posts);
});

module.exports = router;