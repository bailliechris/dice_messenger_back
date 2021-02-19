const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/',  (req, res) => {
    res.send("Welcome to the back end!")
});

module.exports = router;