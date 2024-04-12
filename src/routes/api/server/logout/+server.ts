import { CookieUtils } from '$lib/utils/cookie.utils';
import { SessionManager } from '../../session.manager';
import { logout } from '../../services/user';
import { redirect } from 'sveltekit-flash-message/server';
import { errorMessage, successMessage } from '../../../../lib/utils/message.utils';
////////////////////////////////////////////////////////////////

export const POST = async (event: RequestEvent) => {
	const sessionId = event.cookies.get('sessionId');
	// try {
		console.log('Logging out...');
		const response = await logout(sessionId);
		console.log('response', JSON.stringify(response));
		if (sessionId) {
			const session = await SessionManager.removeSession(sessionId);
			console.log(JSON.stringify(session, null, 2));
		}
		CookieUtils.removeCookieHeader(event, 'sessionId');
        if (response.Status === 'failure' || response.HttpCode !== 200) {
            throw redirect(303, `/`, errorMessage(response.Message), event);
        } 
		throw redirect(303, `/`, successMessage(response.Message), event);
	// } catch (err) {
	// 	console.error(`Error logging out: ${err.message}`);
	// 	return new Response(err.message);
	// }
};
