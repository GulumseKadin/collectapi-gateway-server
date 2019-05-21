import React from 'react';
import { Responsive } from 'semantic-ui-react';
import { ResponsiveConsumer } from './context';

export function SsrResponsive(props) {
	return <ResponsiveConsumer>{value => <Responsive {...props} getWidth={value && value.getWidth} />}</ResponsiveConsumer>;
}

SsrResponsive.onlyComputer = Responsive.onlyComputer;
SsrResponsive.onlyMobile = Responsive.onlyMobile;
SsrResponsive.onlyTablet = Responsive.onlyTablet;
SsrResponsive.onlyLargeScreen = Responsive.onlyLargeScreen;
SsrResponsive.onlyWidescreen = Responsive.onlyWidescreen;
