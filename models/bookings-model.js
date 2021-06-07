const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose => {
    var schema = mongoose.Schema(
      {

        car: { type: Schema.Types.ObjectId, ref: 'cars' },
        user: { type: Schema.Types.ObjectId, ref: 'users' },
        startTime: {type: Date, required: true},
        endTime: {type: Date, required: true},
        price: {type: Number, required: true}

      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Booking = mongoose.model("bookings", schema);
    return Booking;
  };