import type { ChartConfiguration } from 'chart.js';
import { format, parseISO } from "date-fns";
///////////////////////////////////////////////////////////////////////////////
export interface ChartDataPoint {
    x: string;
    y: number;
}
export interface Dataset {
    label: string;
    data: ChartDataPoint[];
}
export interface ProcessedChartData {
    datasets: Dataset[];
}
// Simple random color generator
function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export function createTimeSeriesConfig(chartData: ProcessedChartData): ChartConfiguration {

    const allDates = Array.from(new Set(chartData.datasets.flatMap(dataset => dataset.data.map(point => point.x))))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const enhancedDatasets = chartData.datasets.map(dataset => ({
        ...dataset,
        data: allDates.map(date => dataset.data.find(point => point.x === date)?.y || 0),
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
        clip: false
    }));
    return {
        type: 'line',
        labels: allDates,
        data: {
            datasets: enhancedDatasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'category',
                    labels: allDates,
                    title: {
                        display: true,
                        text: 'Date',
                        // color: textColor
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 0,
                        autoSkipPadding: 10,
                    },
                    grid: {
                        // color: '#E5E5E5'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    },
                    ticks: {
                        stepSize: 1,
                        precision: 0
                    },
                    min: 0,
                    max: Math.ceil(Math.max(...chartData.datasets.flatMap(d => d.data.map(point => point.y)))),
                    grid: {
                        // color: '#E5E5E5'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Tasks by category over Time',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                tooltip: {
                    enabled: true,
                    position: 'nearest',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: 'white',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyColor: 'white',
                    bodyFont: {
                        size: 13
                    },
                    displayColors: true,
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },

        }
    };
}