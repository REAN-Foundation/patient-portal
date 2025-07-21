<script lang="ts">
	import { Chart, Colors, registerables } from 'chart.js';
	import { onMount } from 'svelte';

	Chart.register(...registerables);

    // svelte-ignore export_let_unused
    export let tasks: any[] = [];
    export let view: 'day' | 'week' = 'day';
    export let selectedPlan: string;
    export let careplanTasks: any;

    console.log('careplanData------------------', careplanTasks)

	let canvas: HTMLCanvasElement;
	let chart: Chart;

    $: if (careplanTasks && selectedPlan) {
        console.log('Current tasks:', careplanTasks[selectedPlan]);
    }

    function processTasksData(tasks: any[], viewType: 'day' | 'week') {
        if (!tasks?.length) return { labels: [], datasets: [] };

        const dataMap = new Map();

        tasks.forEach((task) => {
            const frequency = task?.Action?.Frequency;
            if (frequency === undefined) return;

            let key = viewType === 'day' ? `Day ${frequency}` : `Week ${Math.ceil(frequency / 7)}`;

            if (!dataMap.has(key)) {
                dataMap.set(key, { Completed: 0, Delayed: 0 });
            }

            const entry = dataMap.get(key);
            if (task.Status === 'Completed') entry.Completed++;
            else if (task.Status === 'Pending') entry.Delayed++;
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

	// function getThemeColor() {
    //     const theme = document.documentElement.getAttribute('data-theme');
    //     return theme === 'dark' ? '#D9DEE9' : '#1C252A';
    // }
    function getThemeColor(): { textColor: string; gridColor: string } {
		const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
		return {
			textColor: isDarkMode ? '#d9dee9' : '#1c252a',
			gridColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
		};
	}

    function createChart() {
        if (!canvas) {
            console.log('Canvas not available');
            return;
        }

        if (chart) {
            chart.destroy();
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.log('Context not available');
            return;
        }

        const selectedPlancode = careplanTasks.find(
        (plan) => plan.enrollmentId === selectedPlan
        );

        const tasks = selectedPlancode ? selectedPlancode.tasks : [];

        const chartData = processTasksData(tasks, view);
		// const themeColor = getThemeColor();
        const { textColor, gridColor } = getThemeColor();
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
                            // font: {
                            //     size: 16
                            // },
                            color: textColor // Set text color dynamically
                        },
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            display: false
                        },
                        border: {
							color: gridColor
						}
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Tasks',
                            // font: {
                            //     size: 16
                            // },
                            color: textColor
                        },
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            display: true,
                            color: gridColor,
							lineWidth: 0.3,
                        },
                        border: {
							color: gridColor
						}
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Task status by ${view === 'week' ? 'Week' : 'Day'}`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: textColor, // Set text color dynamically
                        padding: 8
                    },
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            color: textColor // Set legend text color dynamically
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

    $: if (canvas && careplanTasks && selectedPlan) {
        console.log('Updating chart with new data');
        createChart();
    }

    $: if (view && canvas && careplanTasks && selectedPlan) {
        console.log('View changed, updating chart');
        createChart();
    }

    onMount(() => {
        console.log('Component mounted');
        if (canvas && careplanTasks && selectedPlan) {
            createChart();
        }

		// Update chart on theme change using MutationObserver
		const updateChartOnThemeChange = () => {
			if (chart) {
				createChart();
			}
		};

		const observer = new MutationObserver(updateChartOnThemeChange);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});

		// Cleanup function
		return () => {
			if (chart) {
				chart.destroy();
			}
			observer.disconnect();
		};
	});
</script>

<div class="h-full w-full">
	<canvas bind:this={canvas}></canvas>
</div>
