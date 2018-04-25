// this file is for our services models
 const mongoose = require('mongoose');
 //creating a new schema & model for a services
 const serviceSchema = mongoose.Schema({
   name: String,
   time: Number,
   description: String
   // time key using MomentJS?
 });
// create model for database
const Services = mongoose.model('Services', serviceSchema);
//export this model out to be made available to routes.js
module.exports = Services;
