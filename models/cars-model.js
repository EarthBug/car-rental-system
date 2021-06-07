const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        carLicenseNumber: { type: String, unique : true, required : true, dropDups: true },
        manufacturer: { type: String, required : true, dropDups: true },
        model: { type: String, required : true, dropDups: true },
        basePrice: { type: Number, required : true, dropDups: true },
        pricePerHour: { type: Number, required : true, dropDups: true },
        securityDeposit: { type: Number, required : true, dropDups: true },
        bookings: [
          {type: Schema.Types.ObjectId, ref: 'bookings'}
        ]
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Car = mongoose.model("cars", schema);
    return Car;
  };