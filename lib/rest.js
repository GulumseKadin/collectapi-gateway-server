import { NextAuth } from 'next-auth/client';

export const rest = async (uri, data) => {
	let _csrf = await NextAuth.csrfToken();
	var formData = {
		_csrf,
		__json__: JSON.stringify(data),
	};
	const encodedForm = Object.keys(formData)
		.map(key => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
		})
		.join('&');
	return fetch(uri, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: encodedForm,
	}).then(data => data.json());
};

export const ssrFetch = (req, uri, body) => {
	let baseUrl = '';
	let method = body ? 'POST' : 'GET';
	if (req) {
		let host = req.get('Host');
		let protocol = req.protocol;
		if (/localhost/.test(host)) protocol = 'http';
		baseUrl = `${protocol}://${host}`;
	}
	if (req) return fetch(baseUrl + uri, { headers: req.headers, method });
	else return fetch(uri, { method });
};

/**
 * example usage
 * 	static async getInitialProps({ req }) {
		let data = await ssrFetch(req, '/rest/user/data/billing').then(it => it.json());;
		return { test: data.data };
	}
 */
