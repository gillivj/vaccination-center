const mongoose = require('mongoose');
const VaccinationCenter = require('../models/vaccination_center.model');
const Nurse = require('../models/nurse.model');
const faker = require('faker');

require('dotenv').config();
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//Create Vaccination Centers and Nurses
Nurse.collection.drop();
VaccinationCenter.collection.drop();
VaccinationCenter.create([
  {
    name: "Radin Mas Community Club",
    address: "51 Telok Blangah Crescent, Singapore 098917",
    vaccine_type: "Moderna"
  },
  {
    name: "Buona Vista Community Club",
    address: "36 Holland Drive, Singapore 270036",
    vaccine_type: "Moderna"
  },
  {
    name: "Tanjong Pagar Community Club",
    address: "101 Cantonment Road, Singapore 089774",
    vaccine_type: "Pfizer/Comirnaty"
  },
  {
    name: "Jalan Besar Community Club",
    address: "69 Jellicoe Road, Singapore 208737",
    vaccine_type: "Pfizer/Comirnaty"
  }
]).then(vaccination_centers => {
  console.log(`${vaccination_centers.length} vaccination centers created`);
  //Create Nurse and associated vaccination center
  const working_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const nurseList = []
  for(let i=0; i< 100;i++){
    const vaccination_center = vaccination_centers[Math.floor(Math.random()*vaccination_centers.length)];

    const shuffled = working_days.sort(() => 0.5 - Math.random());
    const selectedWorkingDays = shuffled.slice(0, 4);;
    nurseList.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      working_days: selectedWorkingDays,
      vaccination_center: vaccination_center
    });   
  }
  Nurse.create(nurseList)
  .then(nurses => {
    console.log(`${nurses.length} nurses created`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
})
.catch((err) => {
  console.log(err);
})

