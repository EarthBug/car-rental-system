var dbConfig =require("../config/db-config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.cars = require("./cars-model.js")(mongoose);
db.users = require("./users-model.js")(mongoose);
db.bookings = require("./bookings-model.js")(mongoose);
module.exports = db;