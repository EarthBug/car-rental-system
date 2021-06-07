var mongoose = require('mongoose');
const db = require("../models/db");
const Booking = db.bookings;
const Car = db.cars;
const User = db.users;

function price(base, pph, security, hours) {
    return Number(base) + (Number(pph) * hours) + Number(security);
}

function timeDiffCalc(dateFuture, dateNow) {
    console.log(dateFuture - dateNow);
    const milliseconds = Math.abs(dateFuture - dateNow);
    console.log(milliseconds);
    const hours = milliseconds / 36e5;
    console.log(hours);
    return hours;
}

exports.search = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    var carList = [];
    var startTime = new Date(req.params.fromDateTime);
    var endTime = new Date(req.params.toDateTime);
    console.log(startTime + endTime);
    Car.find({}).lean()
        .then(data => {
            console.log(data);
            for (var i in data) {
                console.log("i");
                console.log(i);
                if (!(i.booking)) {
                    carList.push(data[i]);
                }
                else if (!((startTime > i.booking.startTime && startTime < i.booking.endTime) || (endTime > i.booking.startTime && endTime < i.booking.endTime) || (startTime < i.booking.startTime && endTime > i.booking.endTime))) {
                    carList.push(data[i]);
                }
            }
            console.log("carList");
            console.log(carList);
            res.send(carList);

        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving cars."
            });
        });




}

exports.price = (req, res) => {
    Car.findOne({ carLicenseNumber: req.params.carID }).lean()
        .then(data => {
            console.log(data)
            if (!data)
                res.status(404).send({ message: "Not found car with id " + req.body.car });
            else {
                res.send({ price: price(data.basePrice, data.pricePerHour, data.securityDeposit, timeDiffCalc(new Date(req.params.toDateTime), new Date(req.params.fromDateTime))) });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving car with id=" + req.body.car });
        });



}

// Create new booking
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    var user = {};
    var car = {};
    var startTime = new Date(req.body.startTime);
    var endTime = new Date(req.body.endTime);

    if ((startTime > endTime || startTime < Date.now())) {
        res.status(400).send({ message: "startTime needs to be before endTime and in the future" });
        return;
    }

    var bookingData = {};
    User.findOne({ userID: req.body.user }).populate('bookings')
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found user with id " + req.body.user });
            else user = data;
        })
        .then(function () {
            return Car.findOne({ carLicenseNumber: req.body.car }).populate('bookings')
        })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found car with id " + req.body.car });
            else car = data;
        })
        .then(function () {
            for (i in car.bookings) {
                if ((startTime >= car.bookings[i].startTime && startTime <= car.bookings[i].endTime) || (endTime >= car.bookings[i].startTime && endTime <= car.bookings[i].endTime) || (startTime <= car.bookings[i].startTime && endTime >= car.bookings[i].endTime)) {
                    //res.status(400).send({ message: "overlapping booking" });
                    var err = {};
                    err.message = "overlapping booking";
                    return Promise.reject(err);
                }
            }
            for (i in user.bookings) {
                if ((startTime >= user.bookings[i].startTime && startTime <= user.bookings[i].endTime) || (endTime >= user.bookings[i].startTime && endTime <= user.bookings[i].endTime) || (startTime <= user.bookings[i].startTime && endTime >= user.bookings[i].endTime)) {
                    //res.status(400).send({ message: "overlapping booking" });
                    var err = {};
                    err.message = "overlapping booking";
                    return Promise.reject(err);
                }
            }
            // Create a booking
            const booking = new Booking({
                car: mongoose.Types.ObjectId(car.id),
                user: mongoose.Types.ObjectId(user.id),
                startTime: startTime,
                endTime: endTime,
                price: price(car.basePrice, car.pricePerHour, car.securityDeposit, timeDiffCalc(endTime, startTime))
            });

            return booking.save(booking);
        })
        .then(data => {
            bookingData = data;
        })
        .then(function () {
            return User.findOneAndUpdate(
                {_id: mongoose.Types.ObjectId(user.id)},
                { $push: { "bookings": mongoose.Types.ObjectId(bookingData.id) } }
            );
        })
        .then(function () {
            return Car.findOneAndUpdate(
                {_id: mongoose.Types.ObjectId(car.id)},
                { $push: { "bookings": mongoose.Types.ObjectId(bookingData.id) } }
            );
        })
        .then(function () {
            res.send(bookingData);
        })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the booking."
                });
            });

};