var express = require('express');
var router = express.Router();

const users = require('../controllers/users-controller.js')


// Create a new User
router.post("/", users.create);

// Retrieve a single User with id
router.get("/:id", users.findOne);

// Retrieve all users
router.get("/", users.findAll);


// Update a User with id
router.put("/:id", users.update);

// Delete a User with id
router.delete("/:id", users.delete);

router.get("/bookings/:id", users.booked)

module.exports = router;

