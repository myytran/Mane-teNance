//this file is for our BOOKING MODEL
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our booking model
var bookingSchema = mongoose.Schema({
  user_id: String,
  time: String,
  start: Date

});

// create the model for the booking  and expose it to our app
module.exports = mongoose.model('Booking', bookingSchema);
