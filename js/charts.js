// Chart management using Chart.js (client-side v2)
class ChartManager {
    constructor() {
        this.charts = {};
        this.chartColors = ['#25d366', '#128c7e', '#dc3545', '#ffc107', '#34b7f1', '#ffcd56', '#ff6384', '#36a2eb', '#4bc0c0', '#fcba03', '#8e44ad'];
    }

    createTimelineChart(canvasId, stats) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas element '${canvasId}' not found`);
            return null;
        }
        
        const ctx = canvas.getContext('2d');
        const labels = stats.map(s => s.label);
        const data = stats.map(s => s.value);
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: { 
                labels, 
                datasets: [{ 
                    label: 'Messages', 
                    data, 
                    borderColor: '#25d366', 
                    backgroundColor: 'rgba(37,211,102,0.2)', 
                    fill: true,
                    tension: 0.4 // Add smooth curve tension
                }] 
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
        return this.charts[canvasId];
    }

    createParticipantsChart(canvasId, participants) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas element '${canvasId}' not found`);
            return null;
        }
        
        const ctx = canvas.getContext('2d');
        const labels = participants.map(p => p.name);
        const data = participants.map(p => p.count);
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: { labels, datasets: [{ data, backgroundColor: participants.map((_,i) => `hsl(${i*360/participants.length},70%,50%)`) }] },
            options: { responsive: true, maintainAspectRatio: false }
        });
        return this.charts[canvasId];
    }

    createMessageTypesChart(canvasId, types) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas element '${canvasId}' not found`);
            return null;
        }
        
        const ctx = canvas.getContext('2d');
        const labels = types.map(t => t.type);
        const data = types.map(t => t.count);
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Types', data, backgroundColor: ['#25d366','#128c7e','#dc3545','#ffc107'] }] },
            options: { responsive: true, maintainAspectRatio: false }
        });
        return this.charts[canvasId];
    }

    createMessageLengthChart(canvasId, stats) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        const labels = stats.map(s => s.range);
        const data = stats.map(s => s.count);
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: { 
                labels, 
                datasets: [{ 
                    label: 'Messages', 
                    data, 
                    backgroundColor: ['#25d366', '#128c7e', '#dcf8c6', '#ece5dd'],
                    borderColor: ['#25d366', '#128c7e', '#dcf8c6', '#ece5dd'],
                    borderWidth: 1
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
        return this.charts[canvasId];
    }

    createEmojiUsageChart(canvasId, stats) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        const labels = stats.map(s => s.emoji);
        const data = stats.map(s => s.count);
        const colors = stats.map((_, i) => `hsl(${i * 36}, 70%, 60%)`);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: { 
                labels, 
                datasets: [{ 
                    data, 
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    }
                }
            }
        });
        return this.charts[canvasId];
    }

    createSharedLinksChart(canvasId, stats) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas element '${canvasId}' not found`);
            return null;
        }
        
        const ctx = canvas.getContext('2d');
        const labels = stats.map(s => s.domain);
        const data = stats.map(s => s.count);
        const colors = stats.map((_, i) => `hsl(${i * 40}, 65%, 55%)`);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: { 
                labels, 
                datasets: [{ 
                    data, 
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 10
                        }
                    }
                }
            }
        });
        return this.charts[canvasId];
    }

    createResponseTimeChart(canvasId, stats) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        const labels = stats.map(s => s.participant);
        const data = stats.map(s => s.average);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: { 
                labels, 
                datasets: [{ 
                    label: 'Avg Response Time (min)', 
                    data, 
                    backgroundColor: '#fcba03',
                    borderColor: '#fcba03',
                    borderWidth: 1
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Minutes'
                        }
                    }
                }
            }
        });
        return this.charts[canvasId];
    }

    createConversationStartersChart(canvasId, stats) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas element '${canvasId}' not found`);
            return null;
        }
        
        const ctx = canvas.getContext('2d');
        const labels = stats.map(s => s.participant);
        const data = stats.map(s => s.count);
        const colors = stats.map((_, i) => `hsl(${i * 50}, 70%, 60%)`);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: { 
                labels, 
                datasets: [{ 
                    data, 
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        return this.charts[canvasId];
    }

    // Additional chart creation methods for comprehensive visualization

    createAdvancedHeatmap(canvasId, data) {
        const container = document.getElementById(canvasId);
        if (!container || !data) return;
        
        // Create a simple heatmap representation
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <h4>Activity Heatmap</h4>
                <p>Peak activity: ${data.max_count || 0} messages</p>
                <p>Most active time period detected</p>
            </div>
        `;
        return null;
    }

    createWordCloudChart(canvasId, data) {
        const container = document.getElementById(canvasId);
        if (!container) {
            console.error(`Container element '${canvasId}' not found`);
            return null;
        }
        if (!Array.isArray(data)) {
            console.error('Word cloud data is not an array:', data);
            return null;
        }
        if (data.length === 0) {
            console.warn('Word cloud data is empty');
            return null;
        }
        
        console.log(`Creating D3 word cloud with ${data.length} words:`, data.slice(0, 5));
        
        // Clear any existing content
        container.innerHTML = '';
        
        // Prepare data for D3 word cloud - reduced font sizes to fit more words
        const words = data.slice(0, 80).map(item => ({
            text: item.word,
            size: Math.max(8, Math.min(32, item.count * 1.2)) // Reduced max size from 60 to 32, reduced multiplier
        }));
        
        // Set dimensions
        const margin = {top: 10, right: 10, bottom: 10, left: 10};
        const width = container.offsetWidth || 800;
        const height = container.offsetHeight || 400;
        const cloudWidth = width - margin.left - margin.right;
        const cloudHeight = height - margin.top - margin.bottom;
        
        // Create SVG
        const svg = d3.select(`#${canvasId}`).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Create word cloud layout
        const layout = d3.layout.cloud()
            .size([cloudWidth, cloudHeight])
            .words(words)
            .padding(2) // Reduced padding from 5 to 2 for tighter spacing
            .rotate(() => ~~(Math.random() * 2) * 90)
            .font("Impact, Arial, sans-serif")
            .fontSize(d => d.size)
            .on("end", draw);
        
        layout.start();
        
        function draw(words) {
            svg.append("g")
                .attr("transform", `translate(${cloudWidth / 2},${cloudHeight / 2})`)
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", d => `${d.size}px`)                    .style("font-family", "Impact, Arial, sans-serif")
                .style("fill", (d, i) => {
                    const colors = ['#25d366', '#128c7e', '#34b7f1', '#ffc107', '#dc3545', '#8e44ad', '#e74c3c', '#f39c12', '#9b59b6', '#3498db'];
                    return colors[i % colors.length];
                })
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
                .text(d => d.text)
                .on("mouseover", function(d) {
                    d3.select(this).style("opacity", 0.7);
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("opacity", 1);
                });
        }
        
        // Store reference for cleanup
        if (this.charts[canvasId]) {
            // Clean up previous chart - handle both Chart.js and D3
            if (this.charts[canvasId].destroy) {
                // Chart.js chart
                this.charts[canvasId].destroy();
            } else {
                // D3 chart - clear the container
                d3.select(`#${canvasId}`).selectAll("*").remove();
            }
        }
        this.charts[canvasId] = { type: 'd3-wordcloud' };
        
        return this.charts[canvasId];
    }

    createEmojiChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !Array.isArray(data)) return null;
        
        const ctx = canvas.getContext('2d');
        
        // Take top 10 emojis like the original
        const emojis = data.slice(0, 10);
        const labels = emojis.map(item => `${item.emoji} (${item.count})`);
        const counts = emojis.map(item => item.count);
        const colors = emojis.map((_, i) => `hsl(${i * 36}, 70%, 60%)`);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: { 
                labels, 
                datasets: [{ 
                    data: counts, 
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { 
                            font: { size: 14 },
                            usePointStyle: true,
                            padding: 10
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
        return this.charts[canvasId];
    }

    createSharedDomainsChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !Array.isArray(data)) return null;
        
        const ctx = canvas.getContext('2d');
        const labels = data.map(item => item.domain || item[0]);
        const counts = data.map(item => item.count || item[1] || 1);
        const colors = data.map((_, i) => `hsl(${i * 40}, 65%, 55%)`);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: { 
                labels, 
                datasets: [{ 
                    data: counts, 
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 10
                        }
                    }
                }
            }
        });
        return this.charts[canvasId];
    }

    createUserMessageLengthChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data) return null;
        
        const ctx = canvas.getContext('2d');
        const labels = Object.keys(data);
        const values = Object.values(data);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: { 
                labels, 
                datasets: [{ 
                    label: 'Avg Message Length', 
                    data: values, 
                    backgroundColor: '#34b7f1',
                    borderColor: '#34b7f1',
                    borderWidth: 1
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Characters'
                        }
                    }
                }
            }
        });
        return this.charts[canvasId];
    }

    createUserEmojiUsageChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data) return null;
        
        const ctx = canvas.getContext('2d');
        
        const users = Object.keys(data);
        const emojiCounts = users.map(user => data[user].count || 0);
        const uniqueEmojis = users.map(user => data[user].unique_emojis || 0);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: users,
                datasets: [
                    {
                        label: 'Total Emojis',
                        data: emojiCounts,
                        backgroundColor: 'rgba(37, 211, 102, 0.7)',
                        borderColor: '#25d366',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Unique Emojis',
                        data: uniqueEmojis,
                        backgroundColor: 'rgba(18, 140, 126, 0.7)',
                        borderColor: '#128c7e',
                        borderWidth: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white'
                    }
                },
                scales: {
                    x: { 
                        title: { 
                            display: true, 
                            text: 'Users',
                            color: '#666'
                        }
                    },
                    y: { 
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { 
                            display: true, 
                            text: 'Total Emojis',
                            color: '#666'
                        },
                        beginAtZero: true
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { 
                            display: true, 
                            text: 'Unique Emojis',
                            color: '#666'
                        },
                        grid: { 
                            drawOnChartArea: false 
                        },
                        beginAtZero: true
                    }
                }
            }
        });
        return this.charts[canvasId];
    }

    createActivityHeatmap(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container || !data) return;

        container.innerHTML = '';

        const heatmapContainer = document.createElement('div');
        heatmapContainer.className = 'heatmap-container';

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const heatmapDays = document.createElement('div');
        heatmapDays.className = 'heatmap-days';
        
        days.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'heatmap-day';
            dayLabel.textContent = day;
            heatmapDays.appendChild(dayLabel);
        });

        const heatmapHours = document.createElement('div');
        heatmapHours.className = 'heatmap-hours';

        const hourLabels = document.createElement('div');
        hourLabels.className = 'heatmap-hour-labels';
        for (let hour = 0; hour < 24; hour++) {
            const hourLabel = document.createElement('div');
            hourLabel.className = 'heatmap-hour';
            hourLabel.textContent = hour.toString().padStart(2, '0');
            hourLabels.appendChild(hourLabel);
        }
        heatmapHours.appendChild(hourLabels);

        const maxValue = Math.max(...Object.values(data).map(dayData => Math.max(...Object.values(dayData))));
        
        days.forEach((day, dayIndex) => {
            const row = document.createElement('div');
            row.className = 'heatmap-row';
            
            for (let hour = 0; hour < 24; hour++) {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                
                const value = data[dayIndex]?.[hour] || 0;
                const intensity = Math.min(10, Math.floor((value / maxValue) * 10));
                
                cell.classList.add(`intensity-${intensity}`);
                cell.textContent = value || '';
                cell.title = `${day} ${hour}:00 - ${value} messages`;
                
                row.appendChild(cell);
            }
            
            heatmapHours.appendChild(row);
        });

        heatmapContainer.appendChild(heatmapDays);
        heatmapContainer.appendChild(heatmapHours);
        container.appendChild(heatmapContainer);
    }
}

window.chartManager = new ChartManager();
