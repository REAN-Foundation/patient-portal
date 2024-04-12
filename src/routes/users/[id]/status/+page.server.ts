import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Helper } from "../../../../lib/utils/helper";

export const load: PageServerLoad = async (event) => {
    const statusCode = event.url.searchParams.get('code');
    let phone = event.url.searchParams.get('phone');
    const patientUserId = event.params.id;
    phone = Helper.getAndValidatePhoneWithCountryCode(phone)
   
    if (!statusCode) {
        throw error(400, 'Oops! Something went wrong');
    }

    return {
        statusCode,
        phone,
        patientUserId
    }
}
