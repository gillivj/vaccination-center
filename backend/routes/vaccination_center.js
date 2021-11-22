const router = require('express').Router();
let VaccinationCenter = require('../models/vaccination_center.model');

/*
* Retunr 
*/
router.route('/').get((req, res) => {
	VaccinationCenter.find()
	.then(vaccination_centers => res.json(vaccination_centers))
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
	const name = req.body.name;
	const address = req.body.address;
	const vaccine_type = req.body.vaccine_type;

	const item = new VaccinationCenter({
		name,
		address,
		vaccine_type
	});

	item.save()
	.then(() => res.json('Vaccination Center added!'))
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
	VaccinationCenter.findById(req.params.id)
		.then(vaccination_center => { 
			vaccination_center.name = req.body.username;
			vaccination_center.address = req.body.address;
			vaccination_center.vaccine_type = Number(req.body.vaccine_type);

			exercise.save()
				.then(() => res.json('Vaccination Center updated!'))
				.catch(err => res.status(400).json('Error: ' + err));
		})
		.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
	VaccinationCenter.findById(req.params.id)
		.then(vaccination_center => res.json(vaccination_center))
		.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
	VaccinationCenter.findByIdAndDelete(req.params.id)
		.then(() => res.json('Vaccination Center deleted.'))
		.catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
