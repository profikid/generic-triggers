import { task, logger } from "@trigger.dev/sdk/v3";
import OpenAI from 'openai';
import { observeOpenAI } from "langfuse";

const openai = observeOpenAI(new OpenAI());


export const DallE = task({
    id: 'dall-e-3',
    run: async ({prompt}: { prompt: string}) =>{
        logger.log(prompt);
          const imageResult = await openai.images.generate({
            model: "dall-e-3",
            prompt
          });
          logger.log('result', {output: imageResult.output })
        return {
            ...imageResult,
            result: imageResult.data[0].url
        }
    }
});

export const openAi = task({
    id: 'open-ai',
    run: async ({model, messages}: {model: string, messages: { role: string, content: string}[]}) =>{
        logger.log(model);
        messages.forEach(message => logger.log(message.content, {message}))

        const request = {
            model,
            messages,
          }
        const result = await openai.chat.completions.create(request);
        logger.log('Result from open ai', {result});
        return {
            ...result,
            result: result.choices[0].message.content
        }
    }
})