var express = require('express');
var router = express.Router();

const cars = require("../controllers/cars-controller.js");
const bookings = require("../controllers/bookings-controller.js")

var router = require("express").Router({ strict: true });

// Create a new Car
router.post("/", cars.create);

// Retrieve a single Car with id
router.get("/:id", cars.findOne);

// Retrieve all cars
router.get("/", cars.findAll);


// Update a Car with id
router.put("/:id", cars.update);

// Delete a Car with id
router.delete("/:id", cars.delete);

router.get("/bookings/:id", cars.booked);

router.post("/book", bookings.create);




module.exports = router;
