<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	// import { getTickColorLight, getTickColorDark } from '$lib/themes/theme.selector';

	/////////////////////////////////////////////////////////////////////////////

	export let labels: string[] = [];
	export let dataSource: number[] = [];
	export let title: string;

	$: console.log('labels', labels);
	$: console.log('dataSource', dataSource);

	let barChart: any;
	let ctx;

	onMount(() => {
		ctx = barChart.getContext('2d');
		barChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: title,
						data: dataSource,
						backgroundColor: '#A8E3F7',
						borderColor: '#D72929',
						borderWidth: 1,
						borderRadius: {
							topLeft: 4,
							topRight: 4
						}
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				indexAxis: 'x',
				scales: {
					x: {
						grid: {
							display: false
						},
						ticks: {
							autoSkip: true,
							autoSkipPadding: 10,
							maxRotation: 30,
							minRotation: 0,
							color: document.documentElement.classList.contains('dark') ? '#808080' : '#808080'
						},
						title: {
							display: true,
							text: 'Dates',
							color: document.documentElement.classList.contains('dark') ? '#808080' : '#808080'
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							display: true,
							color: 'rgba(0, 0, 0, 0.1)', // Light gray, 10% opacity
							lineWidth: 0.3,
							tickBorderDash: [10, 10] // Dashed lines
						},
						ticks: {
							color: document.documentElement.classList.contains('dark') ? '#808080' : '#808080'
						},
						title: {
							display: true,
							text: title,
							color: document.documentElement.classList.contains('dark') ? '#808080' : '#808080'
						}
					}
				},
				layout: {
					padding: {
						bottom: 0
					}
				},
				plugins: {
					legend: {
						display: false,
						labels: {
							color: document.documentElement.classList.contains('dark') ? '#808080' : '#808080',
							boxWidth: 10,
							boxHeight: 10
						}
					},
					title: {
						display: false,
						text: title,
						position: 'top',
						align: 'start',
						padding: 5,
						font: {
							size: 22,
							weight: 'normal',
							lineHeight: 1.2
						}
					},

					tooltip: {
						callbacks: {}
					}
				}
			}
		});
	});
</script>

<div class="chart">
	<canvas bind:this={barChart} class="canvas"></canvas>
</div>
