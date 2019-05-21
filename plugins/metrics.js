//const metrics = require('prom-client');
const { getCollection } = require('../server/database');
const moment = require('moment'),
	Metrics = getCollection('api-metrics'),
	Logs = getCollection('api-logs');
var responseTime = require('response-time');
/* const statusCodeCounter = new metrics.Counter({
	name: 'status_codes',
	help: 'status_code_counter',
	labelNames: ['type', 'status_code', 'consumer', 'apiendpoint'],
});
 */
const plugin = {
	version: '1.0.0',
	policies: ['metrics'],
	schema: {
		$id: 'http://express-gateway.io/plugins/metrics.json',
		type: 'object',
		properties: {
			endpointName: {
				type: 'string',
				default: '/metrics',
			},
		},
		required: ['endpointName'],
	},
	init: function(pluginContext) {
		pluginContext.registerAdminRoute(app => {
			app.get(pluginContext.settings.endpointName, (req, res) => {
				if (req.accepts(metrics.register.contentType)) {
					res.contentType(metrics.register.contentType);
					return res.send(metrics.register.metrics());
				}

				return res.json(metrics.register.getMetricsAsJSON());
			});
		});

		pluginContext.registerPolicy({
			schema: {
				$id: 'http://express-gateway.io/policies/metrics.json',
				type: 'object',
				properties: {
					consumerIdHeaderName: {
						type: 'string',
						default: 'eg-consumer-id',
					},
				},
				required: ['consumerIdHeaderName'],
			},
			name: 'metrics',
			policy: ({ consumerIdHeaderName }) =>
				responseTime((req, res, time) => {
					//res.once('finish', () => {
					const apiEndpoint = req.egContext.apiEndpoint.apiEndpointName;
					const consumerHeader = req.header(consumerIdHeaderName) || 'anonymous';
					const statusCode = res.statusCode.toString();
					const responseType = res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'FAILED';
					const rootRequest = req.egContext.req;
					const orgUrl = rootRequest.originalUrl.replace(/\?.*/, '');
					const ip = rootRequest.headers['x-forwarded-for'] || rootRequest.connection.remoteAddress;
					const currentMonth = moment()
						.startOf('month')
						.valueOf();
					const currentDay = moment()
						.startOf('day')
						.valueOf();
					if (consumerHeader && consumerHeader !== 'anonymous') {
						Metrics.updateOne(
							{ consumerHeader, type: 'month', api: orgUrl, date: currentMonth },
							{
								$setOnInsert: { consumerHeader, api: orgUrl, apiEndpoint, date: currentMonth },
								$inc: { count: 1 },
							},
							{ upsert: true }
						)
							.then()
							.catch(console.error);
						Metrics.updateOne(
							{ consumerHeader, type: 'day', api: orgUrl, date: currentDay },
							{
								$setOnInsert: { consumerHeader, api: orgUrl, apiEndpoint, date: currentDay },
								$inc: { count: 1 },
							},
							{ upsert: true }
						)
							.then()
							.catch(console.error);
					}
					let log = new Logs({
						api: orgUrl,
						consumerHeader,
						apiEndpoint,
						body: rootRequest.body,
						method: rootRequest.method,
						originalUrl: rootRequest.originalUrl,
						statusCode,
						time,
						date: new Date(),
						ip,
					});
					log
						.save()
						.then()
						.catch(console.error);
					//statusCodeCounter.labels(responseType, statusCode, consumerHeader, apiEndpoint).inc();
					//});
				}),
		});
	},
};

module.exports = plugin;
