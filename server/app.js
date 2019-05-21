require('dotenv-extended').load();
const next = require('next');
const nextAuth = require('next-auth');
const nextAuthConfig = require('./next-auth.config');
const nextI18NextMiddleware = require('next-i18next/middleware');
const nextI18next = require('../i18n');
process.on('uncaughtException', function(err) {
	console.error('Uncaught Exception: ', err);
});

process.on('unhandledRejection', (reason, p) => {
	console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason);
});

const dev = process.env.NODE_ENV !== 'production';

const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://collectapi.com';

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app
	.prepare()
	.then(() => {
		return nextAuthConfig();
	})
	.then(nextAuthOptions => {
		return nextAuth(app, nextAuthOptions);
	})
	.then(nextAuthOptions => {
		//const express = nextAuthOptions.express;
		const server = nextAuthOptions.expressApp;
		server.enable('trust proxy')

		//nextI18NextMiddleware(nextI18next, app, server)
		server.use(nextI18NextMiddleware(nextI18next));

		require('./routes')(server, app, nextAuthOptions.functions);
		server.get('/api/:group/:name?', (req, res) => {
			const actualPage = '/api';
			const queryParams = req.params;
			app.render(req, res, actualPage, queryParams);
		});

		server.get('/tags/:name?', (req, res) => {
			let { name } = req.params;
			const actualPage = '/tags';
			const queryParams = req.params;
			app.render(req, res, actualPage, { ...req.query, name });
		});

		server.get('*', (req, res) => {
			handle(req, res);
		});

		// starting express server
		server.listen(port, err => {
			if (err) throw err;
			console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
		});
	});
