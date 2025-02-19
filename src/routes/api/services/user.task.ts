import { BACKEND_API_URL } from "$env/static/private";
import { CacheService } from "$lib/server/cache/cache.service";
import { Helper } from "$lib/utils.ts/helper";
import { DateStringFormat } from "$lib/utils.ts/time.types";
import { error } from "@sveltejs/kit";
import { get_ } from "./common";

/////////////////////////////////////////////////////////////////////////////

export const getUserTasks = async (sessionId: string, searchParams?: any) => {
	let searchString = '';
	if (searchParams) {
		const keys = Object.keys(searchParams);
		if (keys.length > 0) {
			searchString = '?';
			const params = [];
			for (const key of keys) {
				if (searchParams[key]) {
					const param = `${key}=${searchParams[key]}`;
					params.push(param);
				}
			}
			searchString += params.join('&');
		}
	}
	const url = BACKEND_API_URL + `/user-tasks/search${searchString}`;
	const result = await get_(url, true, sessionId);
    return result;
};

export const getEnrollments = async (sessionId: string, patientUserId: string) => {
	const url = BACKEND_API_URL + `/care-plans/patients/${patientUserId}/enrollments`;
	return await get_(url, true, sessionId);
};

export const getCarePlanTasks = async (sessionId: string, userId: string) => {
    let itemsPerPage = 25;
	const today = Helper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
	const cacheKey = `session-${sessionId}:req-getUserTasks:${today}`;
	const yesterday = Helper.getYesterdayDate();
    const yesterdayCacheKey = `session-${sessionId}:req-getUserTasks:${yesterday}`;

    if (await CacheService.has(yesterdayCacheKey)) {
        await CacheService._cache.delete(yesterdayCacheKey);
        console.log(`Cleared old key: ${yesterdayCacheKey}`);
    }
 
    let searchParams = {
        userId: userId,
        ActionType: 'CarePlan',
        itemsPerPage: itemsPerPage
    };

    let response = await getUserTasks(sessionId, searchParams);

    if (response.Status === 'failure' || response.HttpCode !== 200) {
        throw error(response.HttpCode, response.Message || 'An error occurred');
    }

    console.log('response-----', response.Data.UserTasks);

    let userTasks = response.Data.UserTasks.Items;
    let totalCount = response.Data.UserTasks.TotalCount;
    if (totalCount > itemsPerPage) {
        searchParams.itemsPerPage = totalCount;
        response = await getUserTasks(sessionId, searchParams);
        userTasks = response.Data.UserTasks.Items;
    }

    await CacheService.set(cacheKey, userTasks);
    console.log(`Cached data with key: ${cacheKey}`);

    return userTasks;
};

