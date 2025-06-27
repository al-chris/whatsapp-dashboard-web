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
        const fullDates = stats.map(s => s.fullDate || s.label); // Fallback to label if fullDate not available
        
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
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
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
                            title: function(context) {
                                // Show full date in tooltip
                                const index = context[0].dataIndex;
                                return fullDates[index];
                            },
                            label: function(context) {
                                return `Messages: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 10, // Limit number of ticks to prevent overcrowding
                            maxRotation: 45, // Rotate labels for better readability
                            minRotation: 0,
                            font: {
                                size: 11
                            },
                            callback: function(value, index, values) {
                                // Show every nth label based on data density
                                const totalLabels = labels.length;
                                const skipFactor = Math.ceil(totalLabels / 10);
                                return index % skipFactor === 0 ? labels[index] : '';
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        title: {
                            display: true,
                            text: 'Number of Messages'
                        }
                    }
                }
            }
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
        
        // WhatsApp-themed color palette
        const whatsappColors = [
            '#25d366', // WhatsApp green (primary)
            '#128c7e', // Dark teal
            '#34b7f1', // Light blue
            '#17a2b8', // Info blue
            '#28a745', // Success green
            '#007bff', // Primary blue
            '#6c757d', // Secondary gray
            '#20c997', // Teal
            '#fd7e14', // Orange
            '#e83e8c', // Pink
            '#6f42c1', // Purple
            '#dc3545'  // Red
        ];
        const colors = participants.map((_, i) => whatsappColors[i % whatsappColors.length]);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: { 
                labels, 
                datasets: [{ 
                    data, 
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#25d366' // WhatsApp green on hover
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 11
                            }
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

    createMessageTypesChart(canvasId, types) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas element '${canvasId}' not found`);
            return null;
        }
        
        const ctx = canvas.getContext('2d');
        const labels = types.map(t => t.type);
        const data = types.map(t => t.count);
        
        // WhatsApp-themed colors for message types
        const typeColors = {
            'text': '#25d366',      // WhatsApp green for text messages
            'media': '#128c7e',     // Dark teal for media
            'deleted': '#dc3545'    // Red for deleted messages
        };
        const colors = labels.map(label => typeColors[label] || '#6c757d');
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: { 
                labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)), // Capitalize labels
                datasets: [{ 
                    label: 'Message Count', 
                    data, 
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1,
                    hoverBackgroundColor: colors.map(color => color + 'CC'), // Add transparency on hover
                    hoverBorderColor: '#25d366',
                    hoverBorderWidth: 2
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: false 
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed.y} (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Message Type'
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: { 
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Count'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
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
        const averageData = stats.map(s => s.average);
        const medianData = stats.map(s => s.median);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: { 
                labels, 
                datasets: [
                    { 
                        label: 'Average Response Time (min)', 
                        data: averageData, 
                        backgroundColor: '#5fde8b',
                        borderColor: '#4fb573',
                        borderWidth: 1
                    },
                    { 
                        label: 'Median Response Time (min)', 
                        data: medianData, 
                        backgroundColor: '#3d9970',
                        borderColor: '#2e7559',
                        borderWidth: 1
                    }
                ] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y} min`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Users'
                        }
                    },
                    y: { 
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Response Time (minutes)'
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
        
        // WhatsApp-themed color palette
        const whatsappColors = [
            '#25d366', // WhatsApp green (primary)
            '#128c7e', // Dark teal
            '#34b7f1', // Light blue
            '#17a2b8', // Info blue
            '#28a745', // Success green
            '#007bff', // Primary blue
            '#6c757d', // Secondary gray
            '#20c997', // Teal
            '#fd7e14', // Orange
            '#e83e8c', // Pink
            '#6f42c1', // Purple
            '#dc3545'  // Red
        ];
        const colors = stats.map((_, i) => whatsappColors[i % whatsappColors.length]);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: { 
                labels, 
                datasets: [{ 
                    data, 
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#25d366' // WhatsApp green on hover
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
        
        // Prepare data for D3 word cloud with adaptive font size variation
        const maxCount = Math.max(...data.map(item => item.count));
        const minCount = Math.min(...data.map(item => item.count));
        
        // Get container dimensions for adaptive sizing
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width || container.offsetWidth || 400;
        const containerHeight = containerRect.height || container.offsetHeight || 350;
        const isWideCard = containerWidth > 600; // Detect if it's a wide card
        
        // Adjust word count based on card size
        const maxWords = isWideCard ? 80 : 60; // More words for regular cards to fill space
        
        const words = data.slice(0, maxWords).map(item => {
            // Create adaptive size scaling based on container width
            const normalizedSize = (item.count - minCount) / (maxCount - minCount);
            
            // Different font size ranges for wide vs regular cards
            if (isWideCard) {
                // Wide card: slightly reduced font sizes (10px to 42px) to prevent overflow
                const fontSize = Math.max(10, Math.min(42, 10 + (normalizedSize * 32)));
                return { text: item.word, size: fontSize, count: item.count };
            } else {
                // Regular card: increased font sizes (14px to 38px) for better space usage
                const fontSize = Math.max(14, Math.min(38, 14 + (normalizedSize * 24)));
                return { text: item.word, size: fontSize, count: item.count };
            }
        });
        
        // Set dimensions to better use available space
        const width = containerWidth;
        const height = Math.max(340, containerHeight);
        
        // Increase margins to ensure words stay within bounds
        const margin = {
            top: isWideCard ? 10 : 10, 
            right: isWideCard ? 15 : 10, 
            bottom: isWideCard ? 10 : 10, 
            left: isWideCard ? 15 : 10
        };
        const cloudWidth = width - margin.left - margin.right;
        const cloudHeight = height - margin.top - margin.bottom;
        
        // Create SVG that fills the container with proper bounds
        const svg = d3.select(`#${canvasId}`).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("max-width", "100%")
            .style("height", "auto")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Create word cloud layout with adaptive settings and better bounds
        const layout = d3.layout.cloud()
            .size([cloudWidth, cloudHeight])
            .words(words)
            .padding(isWideCard ? 3 : 2) // Increased padding to prevent overlap
            .rotate(() => {
                // More varied rotation for better space usage
                const rotations = [0, 90, -90, 45, -45];
                return rotations[Math.floor(Math.random() * rotations.length)];
            })
            .font("Impact, Arial, sans-serif")
            .fontSize(d => d.size)
            .spiral(isWideCard ? "archimedean" : "rectangular") // Rectangular spiral for better regular card layout
            .on("end", draw);
        
        layout.start();
        
        function draw(words) {
            svg.append("g")
                .attr("transform", `translate(${cloudWidth / 2},${cloudHeight / 2})`)
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", d => `${d.size}px`)
                .style("font-family", "Impact, Arial, sans-serif")
                .style("font-weight", "bold")
                .style("fill", (d, i) => {
                    // Enhanced color palette with better contrast and WhatsApp theme
                    const colors = [
                        '#25d366', '#128c7e', '#34b7f1', '#17a2b8', 
                        '#28a745', '#007bff', '#6c757d', '#343a40',
                        '#fd7e14', '#dc3545', '#6f42c1', '#e83e8c'
                    ];
                    return colors[i % colors.length];
                })
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
                .text(d => d.text)
                .style("cursor", "pointer")
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .style("opacity", 0.7)
                        .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.3)");
                })
                .on("mouseout", function(event, d) {
                    d3.select(this)
                        .style("opacity", 1)
                        .style("text-shadow", "none");
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
        
        // WhatsApp-themed color palette
        const whatsappColors = [
            '#25d366', // WhatsApp green (primary)
            '#128c7e', // Dark teal
            '#34b7f1', // Light blue
            '#17a2b8', // Info blue
            '#28a745', // Success green
            '#007bff', // Primary blue
            '#6c757d', // Secondary gray
            '#20c997', // Teal
            '#fd7e14', // Orange
            '#e83e8c', // Pink
            '#6f42c1', // Purple
            '#dc3545'  // Red
        ];
        const colors = data.map((_, i) => whatsappColors[i % whatsappColors.length]);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: { 
                labels, 
                datasets: [{ 
                    data: counts, 
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#25d366' // WhatsApp green on hover
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 10,
                            font: {
                                size: 11
                            }
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

    createUserMessageLengthChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data) return null;
        
        const ctx = canvas.getContext('2d');
        const labels = Object.keys(data);
        const values = Object.values(data);
        
        // WhatsApp-themed color palette for bars
        const whatsappColors = [
            '#25d366', // WhatsApp green (primary)
            '#128c7e', // Dark teal
            '#34b7f1', // Light blue
            '#17a2b8', // Info blue
            '#28a745', // Success green
            '#007bff', // Primary blue
            '#6c757d', // Secondary gray
            '#20c997', // Teal
            '#fd7e14', // Orange
            '#e83e8c', // Pink
            '#6f42c1', // Purple
            '#dc3545'  // Red
        ];
        const colors = labels.map((_, i) => whatsappColors[i % whatsappColors.length]);
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: { 
                labels, 
                datasets: [{ 
                    label: 'Avg Message Length', 
                    data: values, 
                    backgroundColor: colors,
                    borderColor: colors.map(color => color), // Same color for border
                    borderWidth: 1,
                    hoverBackgroundColor: colors.map(color => color + 'CC'), // Add transparency on hover
                    hoverBorderColor: '#25d366',
                    hoverBorderWidth: 2
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.y} characters`;
                            }
                        }
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Characters'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
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
