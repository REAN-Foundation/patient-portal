import type { RequestEvent } from "@sveltejs/kit";
import { deletePatient } from "../../services/user";
import { SessionManager } from "../../session.manager";
import { CookieUtils } from "$lib/utils/cookie.utils";

export const DELETE = async (event: RequestEvent) => {
    console.log('Inside the delete endpoint.')
	const request = event.request;
    const sessionId = event.cookies.get('sessionId');
	const data = await request.json();
    let response;
	console.log("Delete request data",data, sessionId);
	try {
		response = await deletePatient(
            sessionId,
            data.patientUserId
		);
		console.log('Delete Response ', response)
        if (response.Status === 'failure' || response.HttpCode !== 200) {
            throw new Error(response.Message)
        }

        if (sessionId) {
            const session = await SessionManager.removeSession(sessionId);
            console.log(JSON.stringify(session, null, 2));
        }
        CookieUtils.removeCookieHeader(event, 'sessionId');

        return new Response(JSON.stringify({
            Status: 'success',
            Message: response.Message,
            HttpCode: response.HttpCode
            })
        );
	} catch (err) {
		console.error(`Error deleting patient: ${err.message}`);
		console.log('Response at error +server.ts', response);
		return new Response(JSON.stringify({
            Status: 'failure',
            Message: err.message,
            HttpCode: response.HttpCode ? response.HttpCode : 500
            }),
        );
	}
};
