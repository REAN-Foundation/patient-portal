<script lang="ts">
    import { Chart, registerables } from 'chart.js';
    import { onMount } from 'svelte';

    Chart.register(...registerables);

    export let tasks: any[] = [];
    export let view: 'day' | 'week' = 'day';

    let canvas: HTMLCanvasElement;
    let chart: Chart;

    function processTasksData(tasks: any[], viewType: 'day' | 'week') {
        if (!tasks?.length) return { labels: [], datasets: [] };

        const sortedTasks = [...tasks].sort(
            (a, b) => new Date(a.ScheduledStartTime).getTime() - new Date(b.ScheduledStartTime).getTime()
        );

        const firstDate = new Date(sortedTasks[0].ScheduledStartTime);
        const lastDate = new Date(sortedTasks[sortedTasks.length - 1].ScheduledStartTime);

        const dataMap = new Map();

        if (viewType === 'day') {
            const totalDays = 
				Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            for (let i = 0; i < totalDays; i++) {
                dataMap.set(`Day ${i + 1}`, {
                    Completed: 0,
                    Delayed: 0
                });
            }
        } else {
            const totalWeeks = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
            
            for (let i = 0; i < totalWeeks; i++) {
                dataMap.set(`Week ${i + 1}`, {
                    Completed: 0,
                    Delayed: 0
                });
            }
        }

        sortedTasks.forEach((task) => {
            const taskDate = new Date(task.ScheduledStartTime);
            let key;

            if (viewType === 'day') {
				const dayDiff = Math.floor(
					(taskDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
				);
                key = `Day ${dayDiff + 1}`;
            } else {
				const weekDiff = Math.floor(
					(taskDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
				);
                key = `Week ${weekDiff + 1}`;
            }

            const entry = dataMap.get(key);
            if (entry) {
                if (task.Status === 'Completed') entry.Completed++;
                else if (task.Status === 'Delayed') entry.Delayed++;
            }
        });

        const sortedLabels = Array.from(dataMap.keys()).sort((a, b) => {
            const aNum = parseInt(a.split(' ')[1]);
            const bNum = parseInt(b.split(' ')[1]);
            return aNum - bNum;
        });

        return {
            labels: sortedLabels,
            datasets: [
                {
                    label: 'Completed',
                    data: sortedLabels.map((label) => dataMap.get(label).Completed),
                    backgroundColor: '#22C55E'
                },
                {
                    label: 'Pending',
                    data: sortedLabels.map((label) => dataMap.get(label).Delayed),
                    backgroundColor: '#EF4444'
                }
            ]
        };
    }

    function createChart() {
        if (chart) {
            chart.destroy();
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const chartData = processTasksData(tasks, view);

        chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: view === 'week' ? 'Weeks' : 'Days',
                           font: {
                            size: 16,
                            weight: 'semi-bold'
                        },
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Tasks',
                            font: {
                            size: 16,
                            weight: 'semi-bold'
                        },
                        },
                        grid: {
                            display: true
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Task Status by ${view === 'week' ? 'Week' : 'day'}`,
                        font: {
                            size: 16,
                            weight: 'semi-bold'
                        },
                        padding: { bottom: 2 }
                    },
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                const total = context.chart.data.datasets.reduce(
                                    (sum, dataset) => sum + dataset.data[context.dataIndex],
                                    0
                                );
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            },
                            footer: (tooltipItems) => {
                                const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0);
                                return `Total: ${total} tasks`;
                            }
                        }
                    }
                }
            }
        });
    }

    $: if (canvas && tasks) {
        createChart();
    }

    $: if (view) {
        if (canvas && tasks) {
            createChart();
        }
    }

    onMount(() => {
        if (canvas && tasks) {
            createChart();
        }

        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    });
</script>

<div class="h-full w-full">
    <canvas bind:this={canvas}></canvas>
</div>