import { logger, task } from "@trigger.dev/sdk/v3";
import { Langfuse } from "langfuse";
 
const langfuse = new Langfuse();
 
export const getLangfusePrompt = task({
	id: 'get-langfuse-prompt',
	run: async ({ id, payload }: { id: string, payload: Record<string,string> }) => {
		logger.log('Fetching prompt for task:', { id });

        const prompt = await langfuse.getPrompt(id);
        logger.log('Fetched prompt', {prompt});

        const compiledPrompt = prompt.compile(payload);
        logger.log('Compiled prompt from payload',{compiledPrompt});
		
		return {
			prompt,
            compiledPrompt,
		};
	}
});