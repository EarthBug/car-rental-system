var express = require('express');
var router = express.Router();

const bookings = require("../controllers/bookings-controller.js");

var router = require("express").Router({ strict: true });

router.get("/search-cars/:toDateTime/:fromDateTime", bookings.search);

router.get("/calculate-price/:carID/:toDateTime/:fromDateTime", bookings.price);

module.exports = router;
