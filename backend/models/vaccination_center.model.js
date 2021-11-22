const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VaccinationCenterSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String},
  vaccine_type: {type: String},
  //nurses: [ { type: Schema.Types.ObjectId, ref: 'Nurse' } ]
}, {
  timestamps: true,
});

const VaccinationCenter = mongoose.model('VaccinationCenter', VaccinationCenterSchema);

module.exports = VaccinationCenter;