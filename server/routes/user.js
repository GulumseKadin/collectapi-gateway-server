const router = require('express').Router();
const _ = require('lodash');
const { getCollection } = require('../database');
const gw = require('../lib/gw');
const UserData = getCollection('users-data');
const Analytics = require('../lib/analytic');
router.use((req, res, next) => {
	if (!req.user || !req.user.id) return res.status('403').end();
	next();
});
module.exports = (app, functions) => {
	router.get('/', async (req, res) => {
		let user = await functions.find({ id: req.user.id });
		res.send({ user });
	});

	router.post('/test', async (req, res) => {
		res.send({ user: req.user, body: req.body.json });
	});

	router.post('/update', async (req, res) => {
		let user = await functions.find({ id: req.user.id });
		if (!user) return res.send('id is invalid');
		let newdata = _.pick(req.body.json || {}, ['name', 'surname', 'phone', 'company', 'password']);
		if (!user.profile) user.profile = {};
		user.name = newdata.name;
		_.assignIn(user.profile, newdata);
		await functions.update(user);
		res.send({ user });
	});

	router.get('/token', async (req, res) => {
		let user = await functions.find({ id: req.user.id });
		if (!user) return res.send('id is invalid');
		if (!user.gwid) {
			let gwuser = await gw.user(user, functions);
			user.gwid = gwuser.id;
		}
		let gwtoken = await gw.token(user, functions);
		if (!gwtoken) return res.send({ success: false, message: gwtoken });
		let { keyId, keySecret, scopes, type } = gwtoken;
		res.send({ success: true, gwtoken: `apikey ${keyId}:${keySecret}`, scopes });
	});

	router.get('/data/:type', async (req, res) => {
		let data = await UserData.findOne({ uid: req.user.id, type: req.params.type }).lean();
		res.send(data || { uid: req.user.id, type: req.params.type, data: {} });
	});

	router.post('/data/:type', async (req, res) => {
		res.send(await UserData.updateOne({ uid: req.user.id, type: req.params.type }, { uid: req.user.id, type: req.params.type, data: req.body.json }, { upsert: true }));
	});

	router.post('/analytics/:type', async (req, res) => {
		console.log('type', req.params.type);
		res.send(Analytics[req.params.type] && (await Analytics[req.params.type](req.body.json)));
	});
	return router;
};
