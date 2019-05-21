const fetch = require('node-fetch');
require('dotenv-extended').load();
const MainApi = 'http://localhost:6789' || 'https://api.collectapi.com';
const Tests = require('./apis');
const fs = require('fs');
const _ = require('lodash');
const assert = require('assert');
let current = [];

const tryJson = it => {
	try {
		return JSON.parse(it);
	} catch (error) {
		return it;
	}
};
describe('Gateway', function() {
	describe('Tests', function() {
		Tests.forEach(function(test, i) {
			it('Test -> ' + (test.name || i + 1), async function() {
				let { uri, method, body, response, checkerror = true, test: fn } = test;
				for (var i = 0; i < 1; i++) {
					let res = await fetch(MainApi + uri, { headers: { authorization: 'apikey 3vCNEkNcxRYHVJvb56bmyq:3dQVKnVMLj9zoSdxQvWRKD' } }).then(it => it.text());
					res = test.result = tryJson(res);
					current.push(test);
					await fs.writeFileSync('./test/results.json', JSON.stringify(current));
					if (!fn) console.warn({ uri, res });
					if (fn) assert.equal(!!fn(res) || console.error({ uri, res }), true);
					else if (!_.isUndefined(response)) assert.deepEqual(res, response);
					else if (checkerror) assert.deepEqual(!!res, true);
				}
			});
		});
	});
});
