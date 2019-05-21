import { parser } from './parser';

export const breakPoints = {
	xs: 480,
	sm: 768,
	md: 992,
	lg: 1200,
};

export const defaultSizes = {
	phone: breakPoints.sm - 1,
	tablet: breakPoints.md - 1,
	desktop: breakPoints.lg,
};

export class Responsive {
	constructor(req) {
		this.fakeWidth = defaultSizes.desktop;
		if (req) this.update(req);
		this.getWidth = this.getWidth.bind(this);
	}

	getWidth() {
		const isSSR = typeof window === 'undefined';
		return isSSR ? this.fakeWidth : window.innerWidth;
	}

	update(req) {
		const { phone = false, tablet = false, mobile = false, desktop = false } = parser(req);

		if (mobile) {
			if (phone) {
				this.fakeWidth = defaultSizes.phone;
			} else if (tablet) {
				this.fakeWidth = defaultSizes.tablet;
			} else {
				// TODO - should we ever get here? default to the lowest value i guess
				this.fakeWidth = defaultSizes.phone;
			}
		} else if (desktop) {
			this.fakeWidth = defaultSizes.desktop;
		} else {
			// nothing set, default to our defaultSize
			this.fakeWidth = defaultSizes.desktop;
		}
	}
}
