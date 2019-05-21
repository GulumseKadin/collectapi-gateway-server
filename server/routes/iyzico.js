const router = require('express').Router();

module.exports = (app, functions) => {
	router.post('/payment', async (req, res) => {
		res.send({ user: req.user, body: req.body, query: req.query });
	});

	return router;
};
