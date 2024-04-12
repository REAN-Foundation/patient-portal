import { type RequestEvent, error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { loginWithOtp } from "../api/services/user";
import { redirect } from 'sveltekit-flash-message/server';
import { errorMessage, successMessage } from '../../lib/utils/message.utils';
import { SessionManager } from "../api/session.manager";
import { CookieUtils } from "../../lib/utils/cookie.utils";

export const load:PageServerLoad = async (event: RequestEvent) => {
    let phone = event.url.searchParams.get('phone')
    if (!phone) {
        throw error(500,'Invalid url')
    }
    return {
        phone : phone,
    }
}

export const actions = {
	login: async (event: RequestEvent) => {
		const request = event.request;
        const data = Object.fromEntries(await request.formData());; // or .json(), or .text(), etc
        console.log('Form Data Input', data);

        // const phone_ = data.has('phone') ? data.get('phone') : null;
        // const otp_ = data.has('otp') ? data.get('otp') : null;
        // // const loginRoleId_ = data.has('loginRoleId') ? data.get('loginRoleId') : null;

        // if (!phone_ || !otp_) {
        //     throw error(400, `Phone or OTP values are ill-formatted!`);
        // }
        // const otp = otp_.valueOf() as string;
        // if (otp.length < 6) {
        //     throw error(400, `Otp is not valid!`);
        // }
        // const phone = phone_.valueOf() as string;
        // const loginRoleId = loginRoleId_.valueOf() as number;
        const otp = data.otp as string;
        const phone = data.phone as string;
        console.log('OTPPP: ' + otp);
        const response = await loginWithOtp(otp, phone);
        if (response.Status === 'failure' || response.HttpCode !== 200) {
            console.log(response.Message);
            //Login error, so redirect to the sign-in page
            throw redirect(303, '/', errorMessage(response.Message), event);
        }

        const user = response.Data.User;
        user.SessionId = response.Data.SessionId;
        const accessToken = response.Data.AccessToken;
        const expiryDate = new Date(response.Data.SessionValidTill);
        const sessionId = response.Data.SessionId;
        const userId: string = response.Data.User.id;

        console.log("response",response)

        if (user.Role.RoleName !== 'Patient') {
            throw redirect(303, `/`, errorMessage(`Unsupported user role!`), event);
        }

        const session = await SessionManager.constructSession(user, accessToken, expiryDate);
        if (!session) {
            console.log(`Session cannot be constructed!`);
            throw redirect(303, `/`, errorMessage(`Use login session cannot be created!`), event);
        }
        console.log('Session - ' + JSON.stringify(session, null, 2));
        const userSession = await SessionManager.addSession(session.sessionId, session);
        console.log(JSON.stringify(userSession, null, 2));

        CookieUtils.setCookieHeader(event, 'sessionId', sessionId);

        throw redirect(303, `/users/${userId}/home`, successMessage(`Login successful!`), event);
	}
};

