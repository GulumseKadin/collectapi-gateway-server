import AdminMenu from './AdminMenu';
import { Container, Grid, Segment, Breadcrumb, Divider } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import { isAdmin } from './isAdmin';
import _ from 'lodash';

<Breadcrumb icon="right angle" sections={sections} />;
const sections = [{ key: 'Home', content: 'Home' }, { key: 'Store', content: 'Store' }, { key: 'Shirt', content: 'T-Shirt', active: true }];

const HeaderBreadComponent = props => {
	let urls = props.router.pathname.split('/');
	urls.shift();
	urls = _.map(urls, it => ({ key: it, content: _.capitalize(it) }));
	_.last(urls).active = true;
	return <Breadcrumb icon="right angle" sections={urls} />;
};

const HeaderBread = withRouter(HeaderBreadComponent);

const withAdminLayout = Component => {
	const TempComponent = props => {
		if (!isAdmin(props)) return null;
		return (
			<Container style={{ marginTop: 20 }}>
				<Grid>
					<Grid.Column width={4}>
						<AdminMenu />
					</Grid.Column>
					<Grid.Column width={12}>
						<Segment>
							<HeaderBread />
							<Divider />
							<Component {...props} />
						</Segment>
					</Grid.Column>
				</Grid>
			</Container>
		);
	};
	if (Component.getInitialProps) TempComponent.getInitialProps = Component.getInitialProps;
	return TempComponent;
};

export default withAdminLayout;
