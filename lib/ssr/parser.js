import MobileDetect from 'mobile-detect';

export const parser = ({ headers = {} } = {}) => {
	const userAgent = headers['user-agent'] || headers['User-Agent'];
	const mobileDetect = new MobileDetect(userAgent);

	return {
		desktop: !mobileDetect.mobile(),
		mobile: !!mobileDetect.mobile(),
		phone: !!mobileDetect.phone(),
		tablet: !!mobileDetect.tablet(),
	};
};
