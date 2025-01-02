import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { errorMessage, successMessage } from '$lib/utils.ts/message.utils';
import { deleteFileResource } from '$routes/api/services/file.resource';
import { CacheService } from '$lib/server/cache/cache.service';

////////////////////////////////////////////////////////////////////

export const DELETE = async (event: RequestEvent) => {
    console.log('Inside delete endpoint');
    const sessionId = event.locals?.sessionUser?.sessionId as string;
    const imageResourceId = event.url.searchParams.get('imageResourceId');

    const response = await deleteFileResource(sessionId, imageResourceId);

    if (response.Status == 'failure' || response.HttpCode !== 200) {
        throw redirect(errorMessage(response.Message), event);
    }
    
    throw redirect('/', successMessage(response.Message), event);
};

// export const DELETE = async (event: RequestEvent) => {
// 	const request = event.request;
// 	const data = await request.json();
//     let response;
// 	try {
// 		console.log('Inside image delete server endpoints');
//         const sessionId = event.locals?.sessionUser?.sessionId as string;
//         const imageResourceId = event.url.searchParams.get('imageResourceId');
// 		const response = await deleteFileResource(sessionId, imageResourceId);
// 		return new Response(JSON.stringify({
//             Status: "success",
//             Message : response.Message
//         }));
// 	} catch (err) {
// 		console.error(`Error deleting image: ${JSON.parse(err).message}`);
// 		return new Response(JSON.stringify({
//             Status: "failure",
//             Message : JSON.parse(err).message ? JSON.parse(err).message : 'Error deleting assessment node'
//         }));
// 	}
// };