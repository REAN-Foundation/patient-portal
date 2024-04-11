import type { RequestEvent } from '@sveltejs/kit';
import { generateOtp } from './api/services/user';
import { redirect } from 'sveltekit-flash-message/server';
import { errorMessage, successMessage } from '$lib/utils/message.utils';

export const actions = {
	generateOtp: async (event: RequestEvent) => {
		const request = event.request;
		const formData = Object.fromEntries(await request.formData());
        let countryCode = (formData.countryCode as string).trim();
        countryCode = countryCode.replace('+','');
        const phone = countryCode+'-'+formData.phone as string;
        const response = await generateOtp(phone, "Login");
        console.log('Login Response ', response);
        if (response.Status == "failure" || response.HttpCode !== 200) {
            throw redirect('/', errorMessage(response.Message), event);
        }
        throw redirect(`/patient/delete/confirm?phone=${countryCode}-${formData.phone as string}`, successMessage(response.Message), event);
	}
};
