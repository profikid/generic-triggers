import { logger, task } from '@trigger.dev/sdk/v3';
import axios from 'axios';

export const uploadToCloudflareImages = task({
	id: 'uploadImage',
	run: async (payload: { imageData: Buffer; fileName: string }) => {
		const CLOUD_FLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN; // Your Cloudflare API Token
		const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID; // Your Cloudflare Account ID

		// Log the input data
		logger.log('Uploading image:', payload.fileName);

		try {
			const formData = new FormData();
			formData.append('file', payload.imageData, payload.fileName);

			const result = await axios.post(
				`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${CLOUD_FLARE_API_TOKEN}`,
						...formData.getHeaders()
					}
				}
			);

			logger.log('Image uploaded successfully', result.data);

			return {
				status: 'success',
				data: result.data
			};
		} catch (error) {
			logger.error('Failed to upload image', error);
			throw new Error('Image upload failed');
		}
	}
});
