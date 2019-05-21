import { DateRangePicker, defaultStaticRanges } from 'react-date-range';
import tr from 'react-date-range/dist/locale/tr';
import en from 'react-date-range/dist/locale/en-GB';
import { withNamespaces } from '../i18n';
const dateLocales = { tr, en };
defaultStaticRanges.shift();
defaultStaticRanges.shift();

const Picker = props => (
	<DateRangePicker
		locale={dateLocales[props.i18n.language]}
		ranges={[
			{
				startDate: props.startDate,
				endDate: props.endDate,
				key: 'selection',
			},
		]}
		maxDate={new Date()}
		onChange={props.dateChange}
		staticRanges={defaultStaticRanges}
		inputRanges={[]}
	/>
);

export default withNamespaces()(Picker);
