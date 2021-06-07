const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        userID: { type: String, unique : true, required : true, dropDups: true },
        Mobile: { type: Number, required : true, dropDups: true },
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
  
    const User = mongoose.model("users", schema);
    return User;
  };