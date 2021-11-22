const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NurseSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String},
  working_days: [{type: String}],
  vaccination_center: { type: Schema.Types.ObjectId, ref: 'VaccinationCenter' }  
}, {
  timestamps: true,
});

const Nurse = mongoose.model('Nurse', NurseSchema);

module.exports = Nurse;