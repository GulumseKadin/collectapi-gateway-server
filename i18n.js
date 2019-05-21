const NextI18Next = require('next-i18next');
module.exports = new NextI18Next({
	otherLanguages: ['tr'],
	allLanguages: ['en', 'tr'],
	fallbackLng: 'en',
	defaultLanguage: 'en',
	ignoreRoutes: ['/_next', '/static', '/rest', '/auth'],
	localeSubpaths: true,
	defaultNS: 'common',
	browserLanguageDetection: true,
	serverLanguageDetection: false,
});
