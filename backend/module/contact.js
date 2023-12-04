const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema for contact
const contactSchema = new Schema({
  firstName: { type: String },
  lastName: {type: String},
  phone: {type: String},
  email: { type: String},
  user: {type: String},
});


module.exports = mongoose.model('contactData', contactSchema);