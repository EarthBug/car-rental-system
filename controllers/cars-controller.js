const db = require("../models/db");
const Car = db.cars;

// Create and Save a new Car
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Car
  const car = new Car({
    carLicenseNumber: req.body.carLicenseNumber,
    manufacturer: req.body.manufacturer,
    model: req.body.model,
    basePrice: req.body.basePrice,
    pricePerHour: req.body.pricePerHour,
    securityDeposit: req.body.securityDeposit
  });

  // Save Car in the database
  car
    .save(car)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Car."
      });
    });
};

// Retrieve all Cars from the database.
exports.findAll = (req, res) => {
  // const title = req.query.title;
  // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Car.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cars."
      });
    });
};

// Find a single Car with an id
exports.findOne = (req, res) => {
  console.log(req.params)
  const carLicenseNumber = req.params.id;

  Car.findOne({carLicenseNumber: carLicenseNumber})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Car with id " + carLicenseNumber });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Car with id=" + carLicenseNumber });
    });
};

// Update a Car by the id in the request
exports.update = (req, res) => {
  console.log(req);
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const carLicenseNumber = req.params.id;

  const query = {carLicenseNumber: carLicenseNumber}
  Car.findOneAndUpdate(query, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Car with id=${carLicenseNumber}. Maybe Car was not found!`
        });
      } else res.send({ message: "Car was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Car with id=" + carLicenseNumber
      });
    });
};

// Delete a Car with the specified id in the request (only when no bookings)
exports.delete = (req, res) => {
  const carLicenseNumber = req.params.id;
  const query = {carLicenseNumber: carLicenseNumber}
  Car.findOneAndRemove(query, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Car with id=${carLicenseNumber}. Maybe Car was not found!`
        });
      } else {
        res.send({
          message: "Car was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Car with id=" + carLicenseNumber + err
      });
    });
};

// get bookings of a car

exports.booked = (req, res) => {
  const carLicenseNumber = req.params.id;

  Car.findOne({carLicenseNumber: carLicenseNumber})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Car with id " + carLicenseNumber });
      else res.send(data.bookings);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Car with id=" + carLicenseNumber });
    });
}

