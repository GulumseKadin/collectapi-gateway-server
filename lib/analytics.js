import ReactGA from 'react-ga';

export const initGA = () => {
	if (!window.GA_INITIALIZED) {
		ReactGA.initialize('UA-43334566-17');
		window.GA_INITIALIZED = true;
	}
};

var page = '';
export const logPageView = () => {
	initGA();
	if (page === window.location.pathname) return;
	page = window.location.pathname;
	ReactGA.set({ page });
	ReactGA.pageview(page);
};

export const logEvent = (category = '', action = '') => {
	initGA();
	if (category && action) {
		ReactGA.event({ category, action });
	}
};

export const logException = (description = '', fatal = false) => {
	initGA();
	if (description) {
		ReactGA.exception({ description, fatal });
	}
};
