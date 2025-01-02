
import { type RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { deleteProfileImage } from '$routes/api/services/user';
import { errorMessage, successMessage } from '$lib/utils.ts/message.utils';

//////////////////////////////////////////////////////////////

export const POST = async (event: RequestEvent) => {
    const request = event.request;
	const data = await request.json();
  		const response = await deleteProfileImage(
			data.sessionId,
            data.userId,
			data.ImageResourceId,
		);
   console.log("inside the update profile image api",data);
    if (response.Status == 'failure' || response.HttpCode !== 200) {
        throw redirect(errorMessage(response.Message), event);
    }

    throw redirect(successMessage("Profile image deleted successfully"), event);
};