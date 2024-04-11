import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { Helper } from "../../../../../lib/utils/helper";

export const load: PageServerLoad = async ({params, url}) => {
    const statusCode = url.searchParams.get('code');
    let phone = url.searchParams.get('phone');
    phone = Helper.getAndValidatePhoneWithCountryCode(phone)
   
    if (!statusCode) {
        throw error(400, 'Oops! Something went wrong');
    }

    return {
        statusCode,
        phone,
    }
}
