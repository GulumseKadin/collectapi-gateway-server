const _ = require('lodash');

const gen = key => res => res && res.success && res.result && _.get(res.result, key);

const tests = {
	result: gen('length'),
	array: res => res && res.length,
	key: gen,
};

module.exports = [
	{ uri: '/saglik/nobetciEczane?il=Ankara&ilce=Çankaya', test: tests.result },
	{
		uri: '/halFiyatlari/single?city=istanbul',
		test: tests.result,
	},
	{
		uri: '/halFiyatlari/all',
		test: tests.result,
	},
	{
		uri: '/namaz/all?data.city=istanbul',
		test: tests.result,
	},
	{
		uri: '/namaz/single?data.city=istanbul&ezan=Akşam',
		test: tests.result,
	},
	{
		uri: '/dictionary/wordSearch?data.query=kalem',
		test: tests.result,
	},
	{
		uri: '/economy/allCurrency',
		test: tests.result,
	},
	{
		uri: '/economy/goldPrice',
		test: tests.result,
	},
	{
		uri: '/economy/singleCurrency?tag=USD&int=10',
		test: tests.result,
	},
	{
		uri: '/watching/moviesPlaying',
		test: tests.result,
	},
	{
		uri: '/watching/moviesComing',
		test: tests.result,
	},
	{
		uri: '/watching/seriesRating',
		test: tests.result,
	},
	{
		uri: '/watching/seriesToday',
		test: tests.result,
	},
	{
		uri: '/watching/imdb',
		test: tests.result,
	},
	{
		uri: '/watching/movieSuggest',
		test: tests.result,
	},
	{
		uri: '/watching/tiyatro?data.city=ankara',
		test: tests.result,
	},
	{
		uri: '/objectai/objectDetection?photourl=https://img-flo.mncdn.com/mnresize/1200/1200/media/catalog/product/1/0/100294627_1.jpg',
		test: tests.result,
	},
	{
		uri: '/nudeai/nudeDetection?photourl=http://www.styleclicker.net/wp-content/uploads/2010/10/100812-Trench-Girl-Copenhagen-Oslo-Pladsen-12.jpg',
		test: gen('score'),
	},
	{
		uri: '/sport/goalKings?data.league=spor-toto-super-lig',
		test: tests.result,
	},
	{
		uri: '/sport/league?data.league=spor-toto-super-lig',
		test: tests.result,
	},
	{
		uri: '/sport/results?data.league=spor-toto-super-lig',
		test: tests.result,
	},
	{
		uri: '/sport/formulaStanding',
		test: tests.result,
	},
	{
		uri: '/news/getNews?data.tag=general&data.country=tr',
		test: tests.result,
	},
	{
		uri: '/food/calories?data.query=elma',
		test: tests.result,
	},
	{
		uri: '/food/whenFoods?ay=4',
		test: gen('mevsim_meyve'),
	},
	{
		uri: '/gasPrice/gasoline?data.city=ankara',
		test: tests.result,
	},
	{
		uri: '/gasPrice/diesel?data.city=ankara',
		test: tests.result,
	},
	{
		uri: '/credit/creditBid?data.query=ihtiyac&data.month=12&data.price=1000',
		test: tests.result,
	},
	{
		uri: '/credit/generalBankRate',
		test: tests.result,
	},
	{
		uri: '/credit/mevduat?data.price=10000&data.int=12&data.time=ay',
		test: tests.result,
	},
	{
		uri: '/travel/planeTicket?data.from=istanbul&data.to=ankara',
		test: tests.result,
	},
	{
		uri: '/travel/busTicket?data.from=istanbul&data.to=ankara',
		test: tests.result,
	},
	{
		uri: '/book/bestSeller',
		test: tests.result,
	},
	{
		uri: '/book/newBook',
		test: tests.result,
	},
	{
		uri: '/book/search?data.query=harry%20potter',
		test: tests.result,
	},
	{
		uri: '/chanceGames/sayisalLoto',
		test: tests.result,
	},
	{
		uri: '/chanceGames/superLoto',
		test: tests.result,
	},
	{
		uri: '/ip/ipToLocation?data.ip=95.8.131.139',
		test: gen('ip'),
	},
];
