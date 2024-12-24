<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Chart from 'chart.js/auto';
  
    export let labels: string[] = [];
    export let data: number[] = [];
    export let title: string;
  
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
                label: title,
                data: data,
                borderColor: '#808080',
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
                display:true,
                beginAtZero: false,
                grid: {
                display: true,
                Color: 'rgba(0, 0, 0, 0.1)',
                lineWidth: 0.5,
                borderDash: [5, 30]

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
                color: document.documentElement.classList.contains('dark') ? '#808080' : '#808080',
                font: {
                  size: 22,
                  weight: 'normal',
                  lineHeight: 1.2
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error initializing chart:', error);
      }
    });
  
    onDestroy(() => {
      if (barChart) {
        barChart.destroy();
      }
    });
  </script>
  
  <div class="chart">
    {#if data && data.length > 0}
        <canvas bind:this={barChart} class="canvas"></canvas>
    {:else}
        <p class="not-available">No data available.</p>
    {/if}
</div>
