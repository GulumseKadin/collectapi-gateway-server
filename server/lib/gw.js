const fetch = require('isomorphic-unfetch');
const _ = require('lodash');
class gw {
	constructor() {
		this.__token = 'apikey ' + process.env.GW_TOKEN;
		this.__url = process.env.GW_URL;
	}

	async fetch(uri, data, method) {
		try {
			let opt = { method, headers: { 'Content-Type': 'application/json', Authorization: this.__token } };
			if (data) opt.body = JSON.stringify(data);
			return await fetch(this.__url + uri, opt).then(_ => {
				if (_.status !== 200) return _.text();
				return _.json();
			});
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	get(uri) {
		return this.fetch(uri, null, 'GET');
	}
	delete(uri, data) {
		return this.fetch(uri, data, 'DELETE');
	}
	put(uri, data) {
		return this.fetch(uri, data, 'PUT');
	}
	post(uri, data) {
		return this.fetch(uri, data, 'POST');
	}

	async user(data, functions) {
		let gwuser = await this.get('/users/' + data._id);
		if (_.isString(gwuser) && /^User not found/i.test(gwuser)) {
			gwuser = await this.post('/users', {
				username: data._id,
				firstname: data.name || data.email || 'Name',
				lastname: data.name || data.email || 'Surname',
				email: data.email,
			});
			data.gwid = gwuser.id;
			await functions.update(data);
		}
		return gwuser;
	}

	async token(data, functions) {
		let gwtoken = await this.get('/credentials/' + data.gwid);
		if (gwtoken && gwtoken.credentials && gwtoken.credentials.length) return gwtoken.credentials[0];
		gwtoken = await this.post('/credentials', {
			consumerId: data.gwid,
			type: 'key-auth',
		});
		return gwtoken;
	}
}

module.exports = new gw();
