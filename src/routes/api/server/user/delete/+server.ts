import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { errorMessage, successMessage } from '$lib/utils.ts/message.utils';
import { deletePatient } from '$routes/api/services/user';
import { CookieUtils } from '$lib/utils.ts/cookie.utils';
import { SessionManager } from '$routes/api/sessions/session.manager';

////////////////////////////////////////////////////////////////////

export const DELETE = async (event: RequestEvent) => {
	console.log('Inside delete endpoint');
	const sessionId = event.locals?.sessionUser?.sessionId as string;
	const patientUserId = event.locals?.sessionUser?.userId as string;
	const response = await deletePatient(sessionId, patientUserId);

	if (sessionId) {
				const session = await SessionManager.removeSession(sessionId);
				console.log(JSON.stringify(session, null, 2));
			}
    CookieUtils.removeCookieHeader(event, 'sessionId');
	if (response.Status == 'failure' || response.HttpCode !== 200) {
		throw redirect(errorMessage(response.Message), event);
	}

	throw redirect('/', successMessage(response.Message), event);
};
