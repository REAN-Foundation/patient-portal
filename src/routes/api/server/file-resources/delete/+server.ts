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
    
    // const findAndClearKeys = [`session-${sessionId}:req-getPatientById`];
    // await CacheService.findAndClear(findAndClearKeys)
    
    throw redirect('/', successMessage(response.Message), event);
};
