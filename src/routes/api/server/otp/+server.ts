import { type RequestEvent } from "@sveltejs/kit";
import { generateOtp } from "../../services/user";

//////////////////////////////////////////////////////////////

export const POST = async (event: RequestEvent) => {
    console.log('Server otp post get called...')
    const sessionId = event.cookies.get('sessionId');
	const request = event.request;
	const data = await request.json();
    const phone = data.phone;
    const purpose = data.purpose;
    let response;

    try {
        response = await generateOtp(phone, purpose)
        console.log('Response OTP at +server.ts', response);

        return new Response(JSON.stringify({
            Status: response.Status,
            Message: response.Message,
            HttpCode: response.HttpCode
            })
        )
   	} catch (err:any) {
        console.log('Response at OTP error +server.ts', response);
		return new Response(JSON.stringify({
            Status: 'failure',
            Message: err.message,
            HttpCode: response.HttpCode
            }),
        );
	}
};
