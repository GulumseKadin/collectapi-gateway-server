import React from 'react';
import { Container, Image, List, Segment } from 'semantic-ui-react';
import { withNamespaces, Link } from '../i18n';

const Footer = ({ t }) => {
	return (
		<Segment inverted style={{ width: '100%', height: 58 }} vertical>
			<Container textAlign="center">
				<List horizontal animated inverted divided link>
					<List.Item>
						<Image src="/static/images/knot/knotapi@0,25x.png" centered size="mini" />
					</List.Item>
					<List.Item>
						<Link href="/contact">
							<a className="ui button-footer">{t('contact_us')}</a>
						</Link>
					</List.Item>
					<List.Item>
						<Link href="/terms">
							<a className="ui button-footer">{t('terms')}</a>
						</Link>
					</List.Item>

					<List.Item>
						<Link href="/privacy">
							<a className="ui button-footer">{t('privacy')}</a>
						</Link>
					</List.Item>
				</List>
			</Container>
		</Segment>
	);
};

export default withNamespaces()(Footer);
