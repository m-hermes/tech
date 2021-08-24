'use strict';

const express = require('express');
const router = express.Router();

// Variable to store the current counter value.
let globalCounter = 0;

router.get('/counter/increment',
  (req, res) => {
		res.set('Content-Type', 'text/plain')
		globalCounter++;
    res.send(globalCounter.toString());
  }
);

router.get('/counter/',
  (req, res) => {
		res.set('Content-Type', 'text/plain')
    res.send(globalCounter.toString());
  }
);

module.exports = router;
