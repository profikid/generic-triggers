import { logger, task } from '@trigger.dev/sdk/v3';
import { marked } from 'marked';

export const markdownToHtmlTask = task({
	id: 'md2html',
	run: async (payload: { markdown: string }) => {
		// Log the input markdown text
		logger.log(payload?.markdown || '<no markdown>');

		// Convert the markdown to HTML
		const html = marked(payload.markdown);

		// Log the converted HTML text
		logger.log('HTML', { html });

		return {
			html
		};
	}
});
