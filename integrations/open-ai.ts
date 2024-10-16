import { task, logger } from '@trigger.dev/sdk/v3';
import OpenAI from 'openai';
import { observeOpenAI } from 'langfuse';
import type { ChatCompletionCreateParams } from 'openai/resources/index.mjs';

export const DallE = task({
	id: 'dall-e-3',
	run: async ({ prompt }: { prompt: string }) => {
		const openai = observeOpenAI(new OpenAI());
		logger.log(prompt);
		const imageResult = await openai.images.generate({
			model: 'dall-e-3',
			prompt
		});
		logger.log('result', { output: imageResult.output });
		return {
			...imageResult,
			result: imageResult.data[0].url
		};
	}
});

export const openAi = task({
	id: 'open-ai',
	run: async ({ payload }: { payload: ChatCompletionCreateParams }) => {
		const openai = observeOpenAI(new OpenAI());
		logger.log(payload.model);
		payload.messages.forEach((message) => logger.log(message.content, { message }));

		const result = await openai.chat.completions.create(payload);
		logger.log('Result from open ai', { result });
		return {
			...result,
			result: result.choices[0].message.content
		};
	}
});
