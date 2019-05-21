import React from 'react';
import { Message } from 'semantic-ui-react';
import { withNamespaces } from '../../i18n';

class CheckMail extends React.Component {
	static async getInitialProps({ query }) {
		return {
			email: query.email,
		};
	}

	render() {
		const { t, email } = this.props;
		return (
			<div className="container" style={{ margin: 'auto' }}>
				<Message icon="mail" success header={t('user_created')} content={t('check_mail', { mail: email })} />
			</div>
		);
	}
}
export default withNamespaces()(CheckMail);
