const db = require("../models/db");
const User = db.users;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a User
  const user = new User({
    userID: req.body.userID,
    Mobile: req.body.Mobile
  });

  // Save User in the database
  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all User from the database.
exports.findAll = (req, res) => {
  // const title = req.query.title;
  // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  User.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  console.log(req.params)
  const userID = req.params.id;

  User.findOne({userID: userID})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found user with id " + userID });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving user with id=" + userID });
    });
};

// Update a user by the id in the request
exports.update = (req, res) => {
  console.log(req);
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const userID = req.params.id;

  const query = {userID: userID}
  User.findOneAndUpdate(query, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update user with id=${userID}. Maybe user was not found!`
        });
      } else res.send({ message: "user was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating user with id=" + userID
      });
    });
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const userID = req.params.id;
  const query = {userID: userID}
  User.findOneAndRemove(query, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete user with id=${userID}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "user was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + userID + err
      });
    });
};

exports.booked = (req, res) => {
  const userID = req.params.id;

  User.findOne({userID: userID})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found user with id " + userID });
      else res.send(data.bookings);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving user with id=" + userID });
    });
}
