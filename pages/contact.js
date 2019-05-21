import React from 'react';
import { Message } from 'semantic-ui-react';
import { i18n, withNamespaces, Link } from '../i18n';

const Contact = ({t}) => {
	return (
		<div className="contact">
			<Message floating compact size="huge" className="contact-message">
				<Message.Header>{t('contact_us')}</Message.Header>
				<p>
				{t('contact_us1')}
				</p>
				<h3>{t('address')}</h3>
				<p>Eğitim Mahallesi Kadıköy, İstanbul</p>
				<p>
					<br />
					E-mail: <a href="mailto:info@collectapi.com">info@collectapi.com</a>
				</p>
			</Message>
		</div>
	);
};

Contact.getInitialProps = async () => {
	return { namespacesRequired: [] };
};

export default withNamespaces()(Contact);
