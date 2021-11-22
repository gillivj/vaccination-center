const router = require('express').Router();
const BookingModel = require('../models/booking.model');
const NurseModel = require('../models/Nurse.model');
const moment = require('moment');

const hasVaccinationSlot = (vaccination_center_id, date) => {
	return new Promise(async(resolve, reject) => {

		//Get Total Nurses working on given date
		const weekDayName = moment(date).format('dddd');
		const totalNurses = await NurseModel.countDocuments({
			vaccination_center: vaccination_center_id,
			working_days: weekDayName
		}).exec();
		
		//Get Total bookings for the given date
		const totalBookings = await BookingModel.countDocuments({
			vaccination_center: vaccination_center_id,
			booking_date: date
		}).exec();

		//Assume total slot available equals to total nurses working on the given day
		const slotsLeft = totalNurses - totalBookings;
		if(slotsLeft > 0) {
			resolve("Slots available : "+slotsLeft);
		} else {
			reject("Slot unavailable!");
		}		
	});
};
router.route('/').get(async (req, res) => {		
	BookingModel.find()
	.populate('vaccination_center')
	.then(bookings => res.json(bookings))
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {	
	const booking_date = Date.parse(req.body.date);
	const patient = {
		nric: req.body.nric,
		name: req.body.name
	}
	const vaccination_center = req.body.vaccination_center_id;

	//Check duplicate
	BookingModel.findOne({
		"vaccination_center" : req.body.vaccination_center_id,
		"patient.nric" : req.body.nric
	})
	.then(booking => {
		if(booking){
			res.status(400).json({error: "Duplicate reservation! Your reservation has been booked for "+moment(req.body.date).format('YYYY-MM-DD LT')})
		} else {			
			//Check if vaccination center has slots
			hasVaccinationSlot(vaccination_center, booking_date).then(data => {
				const booking_id = ((new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)).toUpperCase();
				const item = new BookingModel({
					booking_id,
					booking_date,
					patient,
					vaccination_center,
				});
				item.save()
				.then((data) => res.json(data))
				.catch(err => {
					console.log(err)
					res.status(400).json('Error: ' + err)
				});
			}).catch((er) => {
				res.status(400).json({error: 'Vaccination slots not available on selected center and date/time, please try choose different timing or center.'})
			})
		}
	})
	.catch(err => console.log(err));
});

router.route('/:id').get((req, res) => {
	BookingModel.findById(req.params.id)
		.populate('vaccination_center')
		.then(booking => res.json(booking))
		.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
	BookingModel.findByIdAndDelete(req.params.id)
		.then(() => res.json('Booking deleted.'))
		.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {	
	BookingModel.findById(req.params.id)
		.then(async booking => {
			booking.patient = {
				nric: req.body.nric,
				name: req.body.name
			}
			booking.vaccination_center = req.body.vaccination_center_id;
			booking.booking_date = Date.parse(req.body.date);

			booking.save()
				.then(() => res.json('Booking updated!'))
				.catch(err => {
					console.log(err);
					res.status(400).json('Error: ' + err)
				});
		})
		.catch(err => {
			console.log(err);
			res.status(400).json('Error: ' + err)
		});
});

module.exports = router;
