import { error, type ServerLoadEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {getUserTasks } from "$routes/api/services/user.task";
import { formatDate, getDayWiseData, getWeekWiseData } from "$lib/utils.ts/functions";
// import { formatDate} from "$lib/utils.ts/functions";
// import { getPatientStatistics } from "$routes/api/services/statistics";

///////////////////////////////////////////////////////////////////////////////

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const sessionId = event.cookies.get('sessionId') as string;
    const userId = event.params.userId as string;
    let itemsPerPage = 500;
    
    const searchParams = {
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

    // Ensure we have all items
    if (userTasks.TotalCount > itemsPerPage) {
        itemsPerPage = userTasks.TotalCount;
        response = await getUserTasks(sessionId, searchParams);
        userTasks = response.Data.UserTasks.Items;
    }  

    const careplanTasks = userTasks.reduce((groupedTasks, task) => {
        const enrollmentId = task?.Action?.EnrollmentId;
        const planCode = task?.Action?.PlanCode;
    
        if (enrollmentId && planCode) {
            if (!groupedTasks[enrollmentId]) {
                groupedTasks[enrollmentId] = {};
            }
            if (!groupedTasks[enrollmentId][planCode]) {
                groupedTasks[enrollmentId][planCode] = [];
            }
    
            groupedTasks[enrollmentId][planCode].push({
                ...task,
                ScheduledStartTime: task.ScheduledStartTime || task.Action?.ScheduledAt,
                Status: task.Status === "Completed" ? "Completed" : "Pending"
            });
        }
    
        return groupedTasks;
    }, {});

    const enrolledCareplanData = [];
    for (const [enrollmentId, plans] of Object.entries(careplanTasks)) {
        for (const [planCode, tasks] of Object.entries(plans)) {
            enrolledCareplanData.push({ enrollmentId, planCode, tasks });
        }
    }

    return {
        sessionId,
        enrolledCareplanData,
        careplanTasks,
    };
};

function getStartAndEndDates(tasks) {
    if (!tasks || tasks.length === 0) {
        return { startDate: null, endDate: null };
    }
    
    const validTasks = tasks.filter(task => 
        task?.Action?.ScheduledAt || task.ScheduledStartTime
    );
    
    if (validTasks.length === 0) {
        return { startDate: null, endDate: null };
    }

    const startTask = validTasks[0];
    const endTask = validTasks[validTasks.length - 1];
    
    const startDate = formatDate(startTask.Action?.ScheduledAt || startTask.ScheduledStartTime);
    const endDate = formatDate(endTask.Action?.ScheduledAt || endTask.ScheduledStartTime);
    
    return { startDate, endDate };
}

function separateData(data) {
    const labels = Object.keys(data);
    const scheduled = labels.map((label) => data[label].scheduled);
    const completed = labels.map((label) => data[label].completed);
    return { labels, scheduled, completed };
}


