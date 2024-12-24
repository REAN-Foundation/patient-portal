import { getPatientById, updatePatientById } from '$routes/api/services/user';
import { error, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { redirect } from 'sveltekit-flash-message/server';
import { errorMessage, successMessage } from '$lib/utils.ts/message.utils';

///////////////////////////////////////////////////////////////////////////////

export const load: PageServerLoad = async (event: RequestEvent) => {
	try {
		const sessionId = event.cookies.get('sessionId');
		const userId = event.params.userId;
		const response = await getPatientById(sessionId, userId);
		const healthProfile = response.Data;
		return {
			healthProfile,
			sessionId
		};
	} catch (error) {
		console.error(`Error retriving Vitals: ${error}`);
	}
};

const updateUserProfile = zfd.formData({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	gender: z.string().optional(),
	birthDate: z.string().optional(),
	maritalStatus: z.string().optional(),
	email: z.string().optional(),
	// countryCode: z.string().optional(),
	phone: z.string().optional(),
	race: z.string().optional(),
	ethnicity: z.string().optional(),
	strokeSurvivorOrCaregiver: z.string().optional(),
	workedPriorToStroke: z
		.union([
			z.boolean(),
			z.enum(['true', 'false']).transform((val) => (val === 'false' ? false : true))
		])
		.optional(),
	livingAlone: z
		.union([
			z.boolean(),
			z.enum(['true', 'false']).transform((val) => (val === 'false' ? false : true))
		])
		.optional(),
	addressId: z.string().optional(),
	addressLine: z.string().optional(),
	city: z.string().optional(),
	district: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional(),
	postalCode: z.string().optional(),
	imageResourceId: z.string().optional()
});

export const actions = {
	updateprofile: async (event: RequestEvent) => {
		const request = event.request;
		const userId = event.params.userId;
		const sessionId = event.cookies.get('sessionId');
		const data = await request.formData();
		const formData = Object.fromEntries(data);

		type updateProfileSchema = z.infer<typeof updateUserProfile>;
		let result: updateProfileSchema = {};

		try {
			result = updateUserProfile.parse(formData);
		} catch (err: any) {
			const { fieldErrors: errors } = err.flatten();
			console.log(errors);
			const { ...rest } = formData;
			return {
				data: rest,
				errors
			};
		}

		// const phone = result.countryCode + '-' + result.phone;
		
		const response = await updatePatientById(
			sessionId,
			userId,
			result.firstName,
			result.lastName,
			result.gender,
			result.birthDate,
			result.maritalStatus,
			result.email,
			result.phone,
			result.race,
			result.ethnicity,
			result.strokeSurvivorOrCaregiver,
			result.workedPriorToStroke,
			result.livingAlone,
			result.addressLine,
			result.city,
			result.district,
			result.state,
			result.country,
			result.postalCode,
			result.imageResourceId
		);

		if (response.Status == 'failure' || response.HttpCode !== 200) {
			throw redirect(`/users/${userId}/my-profile`, errorMessage(response.Message), event);
		}
		
		throw redirect(
            303,
            `/users/${userId}/my-profile`,
            successMessage(`Profile updated successfully!`),
            event
        );
	}
};
