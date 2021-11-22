const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  booking_id: { type: String, required: true },
  booking_date: { type: Date, required: true },
  patient: new Schema({
    nric: String,
    name: String
  }, { _id : false }),
  vaccination_center: { type: Schema.Types.ObjectId, ref: 'VaccinationCenter' },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;