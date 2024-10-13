import { logger, task } from '@trigger.dev/sdk/v3';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

  export const textEmail = task({
    id: 'send',
    run: async (payload: any) =>{
        logger.log(payload?.subject || '<no subject>');
        logger.log(payload?.message || '<no body>');
        const result = await resend.emails.send({
            from: 'no-reply@profikid.nl',
            to: 'profikid@gmail.com',
            subject: payload.subject,
            text: payload.message
        });

        return {
            ...result,
        }
    }
})

export const htmlEmail = task({
    id: 'send',
    run: async (payload: any) =>{
        logger.log('email payload', {payload})
        const result = await resend.emails.send(payload);
        
        return {
            ...result,
        }
    }
})