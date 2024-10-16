import { task, logger } from '@trigger.dev/sdk/v3';
import OpenAI from 'openai';
import { observeOpenAI } from 'langfuse';
import type { LangfusePromptClient } from 'langfuse-core';
import type { ChatCompletionCreateParams } from 'openai/resources/index.mjs';
import { getLangfusePrompt } from './langfuse';

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

export const openAIFromPrompt = task({
    id: 'open-ai-from-task',
    run: async ({id, payload}: {id: string, payload: Record<string,string>}) => {
		const promptResult = await getLangfusePrompt.triggerAndWait({
			id,
			payload
		});
        const openai = observeOpenAI(new OpenAI(), {langfusePrompt: promptResult.output.prompt});

        logger.log('promptResult', {promptResult});
		const result = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: promptResult.output.compiledPrompt,
            max_tokens: 15000,
        });
		
		return {result}
    }
})

export const openAi = task({
	id: 'open-ai',
	run: async ({ payload, langfusePrompt }: { payload: ChatCompletionCreateParams, langfusePrompt: LangfusePromptClient | undefined }) => {
		const openai = observeOpenAI(new OpenAI(), {langfusePrompt});
		logger.log(payload.model);
		payload.messages.forEach((message) => logger.log(message?.content?.toString() || '', { message }));

		const result = await openai.chat.completions.create(payload);
		logger.log('Result from open ai', { result });
		return {
			...result,
			result: result.choices[0].message.content
		};
	}
});
