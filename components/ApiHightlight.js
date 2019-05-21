import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Label, Segment, Button } from 'semantic-ui-react';
import { API_URL } from '../constants/constants';
import Highlight from './Highlight';
import _ from 'lodash';

const beautifyRequest = data => {
	if (_.isString(data)) {
		let url = API_URL + JSON.stringify(data, null, 2).slice(1, -1);
		return { text: url, url, type: 'bash' };
	} else {
		data = _.clone(data);
		if (data.uri) data.uri = API_URL + data.uri;
		return { text: JSON.stringify(data, null, 2), type: 'json', url: data.uri };
	}
};

export default ({ t, title, value }) => {
	let { text, type, url } = beautifyRequest(value);
	return (
		<Segment style={{ padding: 0 }}>
			<Label attached="top left">{title}</Label>
			<Label as="a" attached="top right" style={{ padding: 0 }}>
				<CopyToClipboard text={url || text}>
					<Button style={{ margin: 0 }} icon="copy" content={t('copy')} size="mini" />
				</CopyToClipboard>
			</Label>
			<Highlight language={type}>{text}</Highlight>
			{/* <pre style={{ padding: '1rem 0 0 1rem' }}>{beautifyRequest(request)}</pre> */}
		</Segment>
	);
};
