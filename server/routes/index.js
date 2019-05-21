module.exports = (server, app, functions) => {
	const router = require('express').Router();
	router.use((req, res, next) => {
		try {
			if (req && req.body && req.body.__json__) req.body.json = JSON.parse(req.body.__json__);
		} catch (error) {
			console.error(error);
		}
		next();
	});
	router.get('/', (req, res) => {
		res.send({ rest: true });
	});

	router.use('/user', require('./user')(app, functions));
	router.use('/admin', require('./admin')(app, functions));
	router.use('/iyzico', require('./iyzico')(app, functions));
	router.use('/apis', require('./apis')(app, functions));

	server.use('/rest', router);
};
