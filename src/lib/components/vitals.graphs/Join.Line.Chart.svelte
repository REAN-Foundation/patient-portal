
  <script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Chart from 'chart.js/auto';
    import annotationPlugin from 'chartjs-plugin-annotation';

    Chart.register(annotationPlugin);

    export let labels: string[] = [];
    export let data1: number[] = []; // Data for first line
    export let data2: number[] = []; // Data for second line
    export let title: string;
    export let systolicReference: number = 120; // Reference line value for systolic
    export let diastolicReference: number = 80; // Reference line value for diastolic

    let barChart: Chart;
    let ctx;

    onMount(() => {
      try {
        ctx = barChart.getContext('2d');
        barChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Systolic',
                data: data1,
                borderColor: '#808080',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 4,
                tension: 0.3
              },
              {
                label: 'Diastolic',
                data: data2,
                borderColor: '#A5DFF3', // Different color for second line
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 4,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
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
                  text: 'Date',
                  color: document.documentElement.classList.contains('dark') ? '#808080' : '#808080'
                }
              },
              y: {
                grid: {
                  display: true,
                  borderColor: 'rgba(0, 0, 0, 0.1)', // Light gray, 10% opacity
                  lineWidth: 0.3,
                  borderDash: [10, 10] // Dashed lines
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
              display: true,
              labels: {
                boxWidth: 15,
                boxHeight: 10,
                usePointStyle: true,
                pointStyle: 'circle',
                generateLabels: (chart) => {
                  return chart.data.datasets.map((dataset, index) => ({
                    text: dataset.label,
                    fillStyle: dataset.borderColor,
                    strokeStyle: dataset.borderColor,
                    lineWidth: 1,
                    borderRadius: 3,
                  }));
                },
                useBorderRadius: true,
                color: '#808080',
              },
            },
              title: {
                display: false,
                text: title,
                color: document.documentElement.classList.contains('dark') ? '#808080' : '#808080',
                font: {
                  size: 22,
                  weight: 'normal',
                  lineHeight: 1.2
                }
              },
              annotation: {
                annotations: {
                  systolicLine: {
                    type: 'line',
                    yMin: systolicReference,
                    yMax: systolicReference,
                    borderColor: '808080', 
                    borderWidth: 0.5,
                    borderDash: [5, 5],
                    label: {
                      content: 'Systolic Reference',
                      enabled: true,
                      position: 'end',
                      color: '#FF0000'
                    }
                  },
                  diastolicLine: {
                    type: 'line',
                    yMin: diastolicReference,
                    yMax: diastolicReference,
                    borderColor: '808080',
                    borderWidth: 0.5,
                    borderDash: [5, 5],
                    label: {
                      content: 'Diastolic Reference',
                      enabled: true,
                      position: 'end',
                      color: '#0000FF'
                    }
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Chart.js initialization error:', error);
      }
    });

    onDestroy(() => {
      if (barChart) {
        barChart.destroy();
      }
    });
</script>

<div class="chart">
  {#if data1 && data1.length > 0 && data2 && data2.length > 0}
      <canvas bind:this={barChart} class="canvas"></canvas>
  {:else}
      <p class="not-available"> data not available.</p>
  {/if}
</div>
