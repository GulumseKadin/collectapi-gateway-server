const _ = require('lodash');
const { getCollection } = require('../database');
const moment = require('moment'),
	Metrics = getCollection('api-metrics'),
	Endpoints = getCollection('endpoint-db'),
	Logs = getCollection('api-logs');

class Analytics {
	static async getMontly(data) {
		let { consumerHeader, startDate, endDate, api, type } = data;
		let select = { consumerHeader, api, type, date: { $gte: startDate, $lt: endDate } };
		let group = {
			_id: '$date',
			total: { $sum: '$count' },
			endpoints: { $addToSet: { endpoint: '$apiEndpoint', count: '$count' } },
		};
		let aggregate = [{ $match: select }, { $group: group }, { $sort: { date: 1 } }];
		let results = await Metrics.aggregate(aggregate);
		return results;
	}
	static async getRequestsInfo(data) {
		let { consumerHeader, startDate, endDate, api, type } = data;
		let select = { consumerHeader, type, date: { $gte: startDate, $lt: endDate } };
		if (api) select.api = api;

		let group = {
			_id: { date: '$date', api: '$apiEndpoint' },
			total: { $sum: '$count' },
			endpoints: { $addToSet: { endpoint: '$api', count: '$count' } },
		};
		let group2 = {
			_id: '$_id.date',
			total: { $sum: '$total' },
			apis: { $addToSet: { api: '$_id.api', count: '$total', endpoints: '$endpoints' } },
		};
		let aggregate = [{ $match: select }, { $group: group }, { $group: group2 }, { $sort: { _id: 1 } }];
		let results = await Metrics.aggregate(aggregate);
		return results;
	}
	static async getRequestsInfoByApi(data) {
		let { consumerHeader, startDate, endDate, api, type } = data;
		let select = { consumerHeader, type, date: { $gte: startDate, $lt: endDate } };
		if (api) select.api = api;

		let group = {
			_id: { date: '$date', api: '$apiEndpoint' },
			total: { $sum: '$count' },
			endpoints: { $addToSet: { endpoint: '$api', count: '$count' } },
		};
		let group2 = {
			_id: '$_id.api',
			total: { $sum: '$total' },
			dates: { $addToSet: { date: '$_id.date', count: '$total', endpoints: '$endpoints' } },
		};
		let aggregate = [{ $match: select }, { $group: group }, { $group: group2 }, { $sort: { _id: 1 } }];
		let results = await Metrics.aggregate(aggregate);
		return results;
	}
	static async getPriceTable(data) {
		let project = {
			endpoint: '$end_point',
			group_id: 1,
			pricing: 1,
		};
		let project2 = {
			_id: 0,
			endpoint: 1,
			api: '$group_id',
			pricing: 1,
			api_pricing: '$api.pricing',
		};
		let lookup = {
			from: 'api-db',
			localField: 'group_id',
			foreignField: 'group_id',
			as: 'api',
		};
		let unwind = { path: '$api' };
		let aggregate = [{ $project: project }, { $lookup: lookup }, { $unwind: unwind }, { $project: project2 }];
		let results = await Endpoints.aggregate(aggregate);
		return results;
	}
}

module.exports = Analytics;
