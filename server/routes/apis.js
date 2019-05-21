const router = require('express').Router();

const { getCollection } = require('../database');

module.exports = (app, functions) => {
	router.get('/list', async (req, res) => {
		query = { disabled: { $ne: true } };
		let list = await getCollection('api-db')
			.find(query)
			.sort({ order: 1 })
			.lean();

		res.send({ success: true, result: list });
	});

	router.get('/list/:id', async (req, res) => {
		let list = await getCollection('api-db').find({ group_id: req.params.id }).lean();

		res.send({ success: true, result: list });
	});

	router.get('/tags/:tag', async (req, res) => {
		let list = await getCollection('api-db').find({ tags: req.params.tag }).lean();

		res.send({ success: true, result: list });
	});

	router.get('/getEndpoints/:id', async (req, res) => {
		let list = await getCollection('endpoint-db').find({ group_id: req.params.id }).lean();

		res.send({ success: true, result: list });
	});

	return router;
};
