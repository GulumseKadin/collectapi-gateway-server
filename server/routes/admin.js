const router = require('express').Router();
const { getCollection } = require('../database');
const Users = getCollection('users');
const gw = require('../lib/gw');
const iyzipay = require('../lib/iyzipay');
router.use((req, res, next) => {
	if (!req.user || !req.user.admin || req.user.admin !== true) return res.status('403').end();
	next();
});

module.exports = (app, functions) => {
	router.get('/user', async (req, res) => {
		let user = await functions.find({ id: req.user.id });
		res.send({ user });
	});

	router.get('/users', async (req, res) => {
		let users = await Users.find({})
			.sort({ emailVerified: -1 })
			.lean();
		res.send({ success: true, users });
	});

	router.get('/user/:id', async (req, res) => {
		let user = await functions.find({ id: req.params.id });
		res.send(user);
	});

	router.get('/gw/scopes', async (req, res) => {
		let ret = await gw.get('/scopes');
		res.send(ret);
	});

	router.get('/gw/generate/:id', async (req, res) => {
		let user = await functions.find({ id: req.params.id });
		if (!user.gwid) {
			let gwuser = await gw.user(user, functions);
			user.gwid = gwuser.id;
		}
		let gwtoken = await gw.token(user, functions);
		res.send({ user, token: gwtoken });
	});

	router.post('/gwuser/:id/scopes', async (req, res) => {
		let user = await functions.find({ id: req.params.id }),
			scopes = req.body.json && req.body.json.scopes;
		if (!user) return res.send('id is invalid');
		let gwtoken = await gw.token(user, functions);
		let ret = gw.put(`/credentials/${gwtoken.type}/${gwtoken.id}/scopes`, { scopes });
		user.scopes = scopes;
		await functions.update(user)
		res.send({ success: true, message: ret });
	});

	router.get('/gw/scopes/add/:scope', async (req, res) => {
		let scope = req.params.scope;
		if (scope === 'admin') return res.send({ success: false, message: "You can't modify admin scope" });
		let ret = await gw.post('/scopes', {
			scopes: [scope],
		});
		res.send({ success: ret || true });
	});

	router.get('/gw/scopes/remove/:scope', async (req, res) => {
		let scope = req.params.scope;
		if (scope === 'admin') return res.send({ success: false, message: "You can't modify admin scope" });
		let ret = await gw.delete('/scopes/' + scope);
		res.send({ success: ret || true });
	});

	router.get('/gwuser', async (req, res) => {
		let ret = await gw.get('/users');
		res.send(ret);
	});

	router.get('/gwuser/:id', async (req, res) => {
		let user = await functions.find({ id: req.params.id });
		if (!user) return res.send('id is invalid');
		let gwuser = await gw.user(user, functions);
		res.send({ user, gwuser });
	});

	router.get('/gwtoken/:id', async (req, res) => {
		let user = await functions.find({ id: req.params.id });
		if (!user) return res.send('id is invalid');
		let gwtoken = await gw.token(user, functions);
		res.send({ user, gwtoken });
	});

	router.get('/gwscopes/:id/add/:scope', async (req, res) => {
		let user = await functions.find({ id: req.params.id });
		if (!user) return res.send('id is invalid');
		let gwtoken = await gw.token(user, functions);
		let result = await gw.put('/credentials/key-auth/' + gwtoken.id + '/scopes/' + req.params.scope);
		res.send({ result });
	});

	router.get('/gwscopes/:id/remove/:scope', async (req, res) => {
		let user = await functions.find({ id: req.params.id });
		if (!user) return res.send('id is invalid');
		let gwtoken = await gw.token(user, functions);
		let result = await gw.delete('/credentials/key-auth/' + gwtoken.id + '/scopes/' + req.params.scope);
		res.send({ result });
	});

	router.get('/ipay', async (req, res) => {
		res.send(`<html><body>${await iyzipay.Render()}</body></html>`);
	});

	return router;
};
