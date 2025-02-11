<script lang="ts">
    import CareplanStackedChart from '$lib/components/careplan/careplan.stacked.chart.svelte';
    import Icon from '@iconify/svelte';
    import type { PageServerData } from './$types';
	import { Helper } from '$lib/utils.ts/helper';

    ///////////////////////////////////////////////////////////////////////////////////////////

    export let data: PageServerData;

    let careplanTasksData = data.enrolledCareplanData;

    $: sortedCareplans = careplanTasksData.sort((a, b) => {
        const aMaxDate = Math.max(...a.tasks.map(task => new Date(task.EndDate || task.ScheduledStartTime).getTime()));
        const bMaxDate = Math.max(...b.tasks.map(task => new Date(task.EndDate || task.ScheduledStartTime).getTime()));

        return bMaxDate - aMaxDate;
    });

    $: selectedEnrollmentId = sortedCareplans.length > 0 ? sortedCareplans[0].enrollmentId : null;
    $: selectedPlancode = careplanTasksData.find(
        (plan) => plan.enrollmentId === selectedEnrollmentId
        );

    $: tasks = selectedPlancode ? selectedPlancode.tasks : [];

    $: careplanTasks = [...tasks].sort((a, b) => {
        const freqA = a?.Action?.Frequency || 0;
        const freqB = b?.Action?.Frequency || 0;
        return freqA - freqB;
    });

    $: careplanData = careplanTasks[0] || {};
    $: careplanCode = careplanData?.Action?.PlanCode ?? '';
    $: careplanName = careplanData?.Action?.PlanName ?? '';

    $: taskStatusCounts = getTaskCounts(careplanTasks);
    $: hasData = Object.keys(careplanTasksData).length > 0;

	$: ({ startDate, endDate } = Helper.getStartAndEndDates(careplanTasks));

    let selectedView: 'day' | 'week' = 'day';

	console.log('startDate', startDate, 'endDate', endDate);

    function getTaskCounts(tasks: any[]) {
		const taskCounts = {
            total: 0,
            completed: 0,
            delayed: 0
        };

		if (!tasks?.length) return taskCounts;

        tasks.forEach((task) => {
			taskCounts.total++;
            switch (task.Status) {
                case 'Completed':
					taskCounts.completed++;
                    break;
                case 'Pending':
					taskCounts.delayed++;
                    break;
            }
        });
		return taskCounts;
    }
</script>

<div class="careplan-container">
    <div class="flex justify-between items-center mb-4">
        <h2 class="careplan-history">Careplan History</h2>
        {#if hasData}
            <div class="flex items-center gap-4">
                <!-- Careplan Selection -->
                <div class="flex items-center gap-2">
                    <span class="title">Careplan:</span>
                    <div class="relative">
                        <select class="select" bind:value={selectedEnrollmentId}>
                            {#each careplanTasksData as careplan}
                                <option value={careplan.enrollmentId}>{careplan.planCode}</option>
                            {/each}
                        </select>
                      
                        <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                            <Icon icon="mdi:chevron-down" class="text-info w-5 h-5" />
                        </div>
                    </div>
                </div>

                <!-- View Selection -->
                <div class="flex items-center gap-2">
                    <span class="title">View:</span>

                    <div class="relative">
					<select class=" select" bind:value={selectedView}>
                            <option value="day">Day Wise</option>
                            <option value="week">Week Wise</option>
                        </select>
                        <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
						    <Icon icon="mdi:chevron-down" class="text-info w-5 h-5 " />
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    {#if hasData}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="status-card">
                <div class="title">Total Tasks</div>
				<div class=" counts">{taskStatusCounts.total || 0}</div>
            </div>
            <div class="status-card">
                <div class="title">Completed</div>
				<div class=" counts">{taskStatusCounts.completed || 0}</div>
            </div>
            <div class="status-card">
                <div class="title">Pending</div>
				<div class=" counts">{taskStatusCounts.delayed || 0}</div>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-6">
            <!-- table -->
            <div class="careplan-info-table">
                <table class="careplan-table">
                    <tbody class="careplan-table-body">
                        <tr class="careplan-table-row">
                            <td class="py-1" style="width: 20%;">Careplan</td>
                            <td class="py-1" style="width: 20%;">{careplanName || '-'}</td>
                        </tr>

                        <tr class="careplan-table-row">
                            <td class="py-1" style="width: 20%;">Code</td>
                            <td class="py-1" style="width: 20%;">{careplanCode || '-'}</td>
                        </tr>
                        <tr class="careplan-table-row">
                            <td class="py-1" style="width: 20%;">Start Date</td>
                            <td class="py-1" style="width: 20%;">{startDate || '-'}</td>
                        </tr>
                        <tr>
                            <td class="py-1" style="width: 20%;">End Date</td>
                            <td class="py-1" style="width: 20%;">{endDate || '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- chart -->
			<div class=" chart">
                <div class="canvas">
                    <CareplanStackedChart 
                    careplanTasks={careplanTasksData}
                     selectedPlan={selectedEnrollmentId}
                        view={selectedView} 
                    />
                </div>
            </div>
			
        </div>
    {:else}
        <p class="not-available">Careplan data not available</p>
    {/if}
</div>
