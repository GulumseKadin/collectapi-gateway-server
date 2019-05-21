//import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import SyntaxHighlighter from 'react-syntax-highlighter';
//import { vs } from 'react-syntax-highlighter/dist/styles/prism';
//import 'highlight.js/styles/github.css';

export default props => {
	return (
		<div className="dahi-highlight">
			<SyntaxHighlighter useInlineStyles={false} {...props} />
		</div>
	);
};
