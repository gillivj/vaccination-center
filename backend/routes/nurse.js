const router = require('express').Router();
const NurseModel = require('../models/Nurse.model');

/*
* Return 
*/
router.route('/').get((req, res) => {
	NurseModel.find()
  .populate('vaccination_center')
	.then(nurses => res.json(nurses))
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const working_days = req.body.working_days;
  const vaccination_center = req.body.vaccination_center_id;

	const item = new NurseModel({
		name,
		email,
		working_days,
    vaccination_center
	});

	item.save()
	.then(() => res.json('Nurse added!'))
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
	NurseModel.findById(req.params.id)
		.then(nurse => { 
			nurse.name = req.body.username;
			nurse.email = req.body.email;
			nurse.working_days = Number(req.body.working_days);
      nurse.vaccination_center = req.body.vaccination_center_id;

			nurse.save()
				.then(() => res.json('Nurse updated!'))
				.catch(err => res.status(400).json('Error: ' + err));
		})
		.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
	NurseModel.findById(req.params.id)
    .populate('vaccination_center')
		.then(nurse => res.json(nurse))
		.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
	NurseModel.findByIdAndDelete(req.params.id)
		.then(() => res.json('Nurse deleted.'))
		.catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
