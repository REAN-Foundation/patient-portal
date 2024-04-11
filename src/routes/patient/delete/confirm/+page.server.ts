import { type RequestEvent, error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load:PageServerLoad = async (event: RequestEvent) => {
    let phone = event.url.searchParams.get('phone')
    if (!phone) {
        throw error(500,'Invalid url')
    }
    return {
        phone : phone,
    }
}

