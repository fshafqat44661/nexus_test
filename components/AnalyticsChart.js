'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function AnalyticsChart({ data }) {
    const doughnutRef = useRef(null);
    const barRef = useRef(null);
    const doughnutChart = useRef(null);
    const barChart = useRef(null);

    useEffect(() => {
        if (!data || !data.categoryStats) return;

        // Destroy existing charts
        if (doughnutChart.current) doughnutChart.current.destroy();
        if (barChart.current) barChart.current.destroy();

        // Doughnut Chart
        const doughnutCtx = doughnutRef.current?.getContext('2d');
        if (doughnutCtx) {
            doughnutChart.current = new Chart(doughnutCtx, {
                type: 'doughnut',
                data: {
                    labels: data.categoryStats.map(s => s.category),
                    datasets: [{
                        data: data.categoryStats.map(s => s.count),
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(236, 72, 153, 0.8)',
                            'rgba(34, 211, 238, 0.8)',
                            'rgba(251, 146, 60, 0.8)',
                        ],
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#fff', padding: 15 }
                        },
                        title: {
                            display: true,
                            text: 'Products by Category',
                            color: '#fff',
                            font: { size: 16, weight: 'bold' }
                        }
                    }
                }
            });
        }

        // Bar Chart
        const barCtx = barRef.current?.getContext('2d');
        if (barCtx) {
            barChart.current = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: data.categoryStats.map(s => s.category),
                    datasets: [{
                        label: 'Inventory Value ($)',
                        data: data.categoryStats.map(s => s.value),
                        backgroundColor: 'rgba(139, 92, 246, 0.8)',
                        borderColor: 'rgba(139, 92, 246, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Inventory Value by Category',
                            color: '#fff',
                            font: { size: 16, weight: 'bold' }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#9ca3af' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#9ca3af' },
                            grid: { display: false }
                        }
                    }
                }
            });
        }

        return () => {
            if (doughnutChart.current) doughnutChart.current.destroy();
            if (barChart.current) barChart.current.destroy();
        };
    }, [data]);

    if (!data) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
                <div className="h-64">
                    <canvas ref={doughnutRef}></canvas>
                </div>
            </div>
            <div className="glass-panel p-6">
                <div className="h-64">
                    <canvas ref={barRef}></canvas>
                </div>
            </div>
        </div>
    );
}
