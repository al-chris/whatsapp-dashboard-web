// Main application for client-side v2 app
class WhatsAppClientApp {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.uploadSection = document.getElementById('uploadSection');
        this.dashboardSection = document.getElementById('dashboardSection');
        this.totalMessagesEl = document.getElementById('totalMessages');
        this.totalParticipantsEl = document.getElementById('totalParticipants');
        this.dateRangeEl = document.getElementById('dateRange');
        this.avgMessagesPerDayEl = document.getElementById('avgMessagesPerDay');
        this.currentTimelineGranularity = 'daily';
        this.currentChatData = null;
        this.init();
    }

    init() {
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag and drop functionality
        const uploadZone = document.getElementById('uploadZone');
        if (uploadZone) {
            uploadZone.addEventListener('click', () => this.fileInput.click());
            uploadZone.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            uploadZone.addEventListener('drop', this.handleDrop.bind(this));
        }
        
        // Navigation buttons
        document.getElementById('homeBtn').addEventListener('click', () => this.showSection('upload'));
        document.getElementById('dashboardBtn').addEventListener('click', () => this.showSection('dashboard'));
        
        // View dashboard button
        const viewDashboardBtn = document.getElementById('viewDashboardBtn');
        if (viewDashboardBtn) {
            viewDashboardBtn.addEventListener('click', () => this.showSection('dashboard'));
        }
        
        // Timeline controls
        const timelineControls = document.getElementById('timelineControls');
        if (timelineControls) {
            timelineControls.addEventListener('change', (e) => {
                this.currentTimelineGranularity = e.target.value;
                if (this.currentChatData) {
                    this.updateTimelineChart();
                }
            });
        }
        
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('content-tab')) {
                this.switchTab(e.target);
            }
        });
        
        this.showSection('upload');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.fileInput.files = files;
            this.handleFileUpload({ target: { files } });
        }
    }

    switchTab(clickedTab) {
        const tabContainer = clickedTab.parentElement;
        const contentContainer = tabContainer.nextElementSibling.parentElement;
        
        // Remove active class from all tabs in this container
        tabContainer.querySelectorAll('.content-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Hide all tab contents in this container
        contentContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Activate clicked tab
        clickedTab.classList.add('active');
        
        // Show corresponding content
        const targetTab = clickedTab.dataset.tab;
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    showSection(section) {
        if (section === 'upload') {
            this.uploadSection.classList.add('active');
            this.dashboardSection.classList.remove('active');
            document.getElementById('homeBtn').classList.add('active');
            document.getElementById('dashboardBtn').classList.remove('active');
        } else {
            this.uploadSection.classList.remove('active');
            this.dashboardSection.classList.add('active');
            document.getElementById('homeBtn').classList.remove('active');
            document.getElementById('dashboardBtn').classList.add('active');
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Show progress
        this.showUploadProgress();
        
        const reader = new FileReader();
        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                const progress = (e.loaded / e.total) * 100;
                this.updateProgress(progress, 'Reading file...');
            }
        };
        
        reader.onload = () => {
            this.updateProgress(75, 'Parsing chat data...');
            
            setTimeout(() => {
                try {
                    const text = reader.result;
                    const result = ChatParser.parse(text);
                    this.currentChatData = result;
                    
                    this.updateProgress(100, 'Complete!');
                    
                    setTimeout(() => {
                        this.showUploadResult(result);
                        this.renderDashboard(result);
                    }, 500);
                    
                } catch (error) {
                    console.error('Error parsing chat:', error);
                    this.hideUploadProgress();
                    alert('Error parsing chat file. Please ensure it\'s a valid WhatsApp export.');
                }
            }, 500);
        };
        
        reader.onerror = () => {
            this.hideUploadProgress();
            alert('Error reading file');
        };
        
        this.updateProgress(25, 'Starting upload...');
        reader.readAsText(file);
    }

    showUploadProgress() {
        const uploadProgress = document.getElementById('uploadProgress');
        const uploadResult = document.getElementById('uploadResult');
        if (uploadProgress) uploadProgress.style.display = 'block';
        if (uploadResult) uploadResult.style.display = 'none';
    }

    hideUploadProgress() {
        const uploadProgress = document.getElementById('uploadProgress');
        if (uploadProgress) uploadProgress.style.display = 'none';
    }

    updateProgress(percent, text) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        if (progressFill) progressFill.style.width = percent + '%';
        if (progressText) progressText.textContent = text;
    }

    showUploadResult(data) {
        this.hideUploadProgress();
        
        const uploadResult = document.getElementById('uploadResult');
        const uploadStats = document.getElementById('uploadStats');
        
        if (uploadResult && uploadStats) {
            // Generate stats HTML
            const startDate = data.dateRangeStart ? data.dateRangeStart.toLocaleDateString() : 'Unknown';
            const endDate = data.dateRangeEnd ? data.dateRangeEnd.toLocaleDateString() : 'Unknown';
            
            uploadStats.innerHTML = `
                <div class="stat-item">
                    <div class="stat-number">${data.messages.length.toLocaleString()}</div>
                    <div class="stat-label">Messages</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${data.participants.length}</div>
                    <div class="stat-label">Participants</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${startDate} - ${endDate}</div>
                    <div class="stat-label">Date Range</div>
                </div>
            `;
            
            uploadResult.style.display = 'block';
        }
    }

    renderDashboard(data) {
        // Show dashboard content
        const dashboardContent = document.getElementById('dashboardContent');
        if (dashboardContent) {
            dashboardContent.style.display = 'block';
        }
        
        // Update metrics
        this.updateMetrics(data);
        
        // Prepare stats for all charts
        const timelineStats = this.computeTimelineStats(data.messages, this.currentTimelineGranularity);
        const participantStats = this.computeParticipantStats(data.messages);
        const typeStats = this.computeTypeStats(data.messages);
        const lengthStats = this.computeLengthStats(data.messages);
        const emojiStats = this.computeEmojiStats(data.messages);
        const linkStats = this.computeLinkStats(data.messages);
        const responseStats = this.computeResponseStats(data.messages);
        const starterStats = this.computeStarterStats(data.messages);
        const wordCloudStats = this.computeWordCloudStats(data.messages);
        const userLengthStats = this.computeUserLengthStats(data.messages);
        const userEmojiStats = this.computeUserEmojiStats(data.messages);
        const userWordClouds = this.computeUserWordClouds(data.messages);
        const pauseStats = this.computePauseStats(data.messages);
        const heatmapStats = this.computeHeatmapStats(data.messages);
        
        // Render all charts
        this.renderAllCharts({
            timeline: timelineStats,
            participants: participantStats,
            types: typeStats,
            lengths: lengthStats,
            emojis: emojiStats,
            links: linkStats,
            responses: responseStats,
            starters: starterStats,
            wordCloud: wordCloudStats,
            userLengths: userLengthStats,
            userEmojis: userEmojiStats,
            userWordClouds: userWordClouds,
            pauses: pauseStats,
            heatmap: heatmapStats
        });
    }

    updateMetrics(data) {
        this.totalMessagesEl.textContent = data.messages.length.toLocaleString();
        this.totalParticipantsEl.textContent = data.participants.length;
        
        const start = data.dateRangeStart;
        const end = data.dateRangeEnd;
        this.dateRangeEl.textContent = start && end ?
            `${start.toLocaleDateString()} - ${end.toLocaleDateString()}` : '-';
            
        // Calculate avg messages per day
        if (start && end) {
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            const avgPerDay = Math.round(data.messages.length / days);
            this.avgMessagesPerDayEl.textContent = avgPerDay.toLocaleString();
        } else {
            this.avgMessagesPerDayEl.textContent = '0';
        }
    }

    updateTimelineChart() {
        if (!this.currentChatData) return;
        const timelineStats = this.computeTimelineStats(this.currentChatData.messages, this.currentTimelineGranularity);
        chartManager.createTimelineChart('messagesTimeChart', timelineStats);
    }

    renderAllCharts(stats) {
        // Basic charts
        chartManager.createTimelineChart('messagesTimeChart', stats.timeline);
        chartManager.createParticipantsChart('participantChart', stats.participants);
        chartManager.createMessageTypesChart('messageTypesChart', stats.types);
        
        // Advanced charts
        chartManager.createMessageLengthChart('userMessageLengthChart', stats.lengths);
        chartManager.createEmojiUsageChart('userEmojiUsageChart', stats.emojis);
        chartManager.createResponseTimeChart('responseTimeChart', stats.responses);
        chartManager.createConversationStartersChart('conversationStartersChart', stats.starters);
        
        // Content analysis charts
        chartManager.createWordCloudChart('wordCloudChart', stats.wordCloud);
        chartManager.createEmojiChart('emojiChart', stats.emojis);
        chartManager.createSharedDomainsChart('sharedDomainsChart', stats.links);
        
        // User statistics charts
        chartManager.createUserMessageLengthChart('userMessageLengthChart', stats.userLengths);
        chartManager.createUserEmojiUsageChart('userEmojiUsageChart', stats.userEmojis);
        
        // Activity heatmap
        chartManager.createActivityHeatmap('activityHeatmap', stats.heatmap);
        
        // User word clouds
        this.createUserWordClouds(stats.userWordClouds);
        
        // Longest pauses
        this.createLongestPausesList(stats.pauses);
    }

    // Enhanced computation methods
    computeTimelineStats(messages, granularity = 'daily') {
        const counts = {};
        messages.forEach(msg => {
            let dateKey;
            const date = new Date(msg.timestamp);
            
            if (granularity === 'daily') {
                dateKey = date.toISOString().split('T')[0];
            } else if (granularity === 'weekly') {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                dateKey = weekStart.toISOString().split('T')[0];
            } else if (granularity === 'monthly') {
                dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            }
            
            counts[dateKey] = (counts[dateKey] || 0) + 1;
        });
        
        // Create formatted labels based on granularity
        return Object.keys(counts).sort().map(date => {
            let formattedLabel;
            if (granularity === 'daily') {
                // Format: MM/DD (shorter format)
                const d = new Date(date);
                formattedLabel = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
            } else if (granularity === 'weekly') {
                // Format: MM/DD (week start)
                const d = new Date(date);
                formattedLabel = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
            } else if (granularity === 'monthly') {
                // Format: YYYY-MM
                formattedLabel = date;
            }
            
            return { 
                label: formattedLabel, 
                value: counts[date],
                fullDate: date // Keep full date for tooltips
            };
        });
    }

    computeParticipantStats(messages) {
        const counts = {};
        messages.forEach(msg => {
            counts[msg.participant] = (counts[msg.participant] || 0) + 1;
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }

    computeTypeStats(messages) {
        const types = { text: 0, media: 0, deleted: 0 };
        
        // System messages patterns to filter out (like Python implementation)
        const systemMessages = [
            'messages and calls are end-to-end encrypted',
            'created group',
            'added',
            'removed',
            'left',
            'changed the group description',
            'changed the subject',
            'changed this group\'s icon'
        ];
        
        messages.forEach(msg => {
            const lower = msg.content.toLowerCase();
            
            // Skip system messages (like Python implementation)
            const isSystemMessage = systemMessages.some(sysMsg => lower.includes(sysMsg));
            if (isSystemMessage) {
                return; // Skip this message
            }
            
            // Enhanced media detection (matching Python logic)
            if (lower.includes('<media omitted>') || 
                lower.includes('image omitted') || 
                lower.includes('video omitted') ||
                lower.includes('audio omitted') ||
                lower.includes('document omitted') ||
                lower.includes('gif omitted') ||
                lower.includes('sticker omitted') ||
                lower.includes('contact card omitted')) {
                types.media++;
            }
            // Enhanced deleted message detection
            else if (lower.includes('this message was deleted') || 
                     lower.includes('you deleted this message') ||
                     lower.includes('message deleted')) {
                types.deleted++;
            }
            // Everything else is text
            else {
                types.text++;
            }
        });
        
        return Object.entries(types).map(([type, count]) => ({ type, count }));
    }

    computeLengthStats(messages) {
        // Message length distribution based on character count
        const buckets = {'Short (0-20)':0,'Medium (21-50)':0,'Long (51-100)':0,'Very Long (100+)':0};
        messages.forEach(m => {
            const l = m.content.length;
            if (l<=20) buckets['Short (0-20)']++;
            else if (l<=50) buckets['Medium (21-50)']++;
            else if (l<=100) buckets['Long (51-100)']++;
            else buckets['Very Long (100+)']++;
        });
        return Object.entries(buckets).map(([range,count])=>({range,count}));
    }

    computeEmojiStats(messages) {
        const counts = {};
        // Comprehensive emoji regex matching the Python implementation
        const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}]+/gu;
        messages.forEach(m => {
            const emojis = m.content.match(emojiRegex);
            if (emojis) {
                emojis.forEach(emoji => {
                    counts[emoji] = (counts[emoji]||0)+1;
                });
            }
        });
        return Object.entries(counts)
            .sort(([,a],[,b]) => b-a)
            .slice(0,10)
            .map(([emoji,count])=>({emoji,count}));
    }

    computeLinkStats(messages) {
        const counts = {};
        const urlRegex = /https?:\/\/(?:[-\w.])+(?:\.[a-zA-Z]{2,})+(?:\/[^?\s]*)?(?:\?[^#\s]*)?(?:#[^\s]*)?/g;
        messages.forEach(m => {
            const links = m.content.match(urlRegex) || [];
            links.forEach(link => {
                try {
                    const domain = (new URL(link)).hostname;
                    counts[domain] = (counts[domain]||0)+1;
                } catch(e) {
                    // Skip invalid URLs
                }
            });
        });
        return Object.entries(counts)
            .sort(([,a],[,b]) => b-a)
            .slice(0,10)
            .map(([domain,count])=>({domain,count}));
    }

    computeResponseStats(messages) {
        const responseTimes = {};
        const responseCounts = {};
        const allResponseTimes = {}; // Store all individual response times for median calculation
        
        for (let i = 1; i < messages.length; i++) {
            const current = messages[i];
            const previous = messages[i-1];
            
            // Only count as response if different participant and within 1 hour
            if (current.participant !== previous.participant) {
                const timeDiff = (current.timestamp - previous.timestamp) / 1000; // seconds
                if (timeDiff > 0 && timeDiff < 3600) { // within 1 hour
                    if (!responseTimes[current.participant]) {
                        responseTimes[current.participant] = 0;
                        responseCounts[current.participant] = 0;
                        allResponseTimes[current.participant] = [];
                    }
                    responseTimes[current.participant] += timeDiff;
                    responseCounts[current.participant]++;
                    allResponseTimes[current.participant].push(timeDiff);
                }
            }
        }
        
        return Object.entries(responseTimes).map(([participant, totalTime]) => {
            const times = allResponseTimes[participant].sort((a, b) => a - b);
            const median = times.length % 2 === 0
                ? (times[times.length / 2 - 1] + times[times.length / 2]) / 2
                : times[Math.floor(times.length / 2)];
                
            return {
                participant,
                average: Math.round(totalTime / responseCounts[participant] / 60), // minutes
                median: Math.round(median / 60) // minutes
            };
        });
    }

    computeStarterStats(messages) {
        const counts = {};
        const conversationThreshold = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
        
        if (messages.length > 0) {
            // First message is always a conversation starter
            const firstMsg = messages[0];
            counts[firstMsg.participant] = 1;
            
            for (let i = 1; i < messages.length; i++) {
                const current = messages[i];
                const previous = messages[i-1];
                const timeDiff = current.timestamp - previous.timestamp;
                
                // If there's a long pause (>4 hours), current message starts new conversation
                if (timeDiff > conversationThreshold) {
                    counts[current.participant] = (counts[current.participant] || 0) + 1;
                }
            }
        }
        
        return Object.entries(counts)
            .sort(([,a],[,b]) => b-a)
            .map(([participant,count])=>({participant,count}));
    }

    computeWordCloudStats(messages) {
        const wordCounts = {};
        const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'a', 'an', 'is', 'are', 'was', 'were', 'this', 'that', 'it', 'i', 'you', 'he', 'she', 'we', 'they']);
        
        // Filter out system messages and media messages
        const textMessages = messages.filter(msg => 
            msg.content && 
            msg.content.trim() !== '' &&
            !msg.content.includes('<Media omitted>') &&
            !msg.content.includes('This message was deleted') &&
            !msg.content.includes('Messages and calls are end-to-end encrypted')
        );
        
        console.log(`Processing ${textMessages.length} text messages for word cloud`);
        
        textMessages.forEach(msg => {
            const words = msg.content.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
            words.forEach(word => {
                if (!stopWords.has(word)) {
                    wordCounts[word] = (wordCounts[word] || 0) + 1;
                }
            });
        });
        
        const result = Object.entries(wordCounts)
            .sort(([,a],[,b]) => b-a)
            .slice(0, 50)
            .map(([word, count]) => ({ word, count }));
            
        console.log('Word cloud data:', result.slice(0, 10));
        return result;
    }

    computeUserLengthStats(messages) {
        const userLengths = {};
        const userCounts = {};
        
        messages.forEach(msg => {
            if (!userLengths[msg.participant]) {
                userLengths[msg.participant] = 0;
                userCounts[msg.participant] = 0;
            }
            userLengths[msg.participant] += msg.content.length;
            userCounts[msg.participant]++;
        });
        
        const result = {};
        Object.keys(userLengths).forEach(user => {
            result[user] = Math.round(userLengths[user] / userCounts[user]);
        });
        
        return result;
    }

    computeUserEmojiStats(messages) {
        const userEmojis = {};
        const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}]+/gu;
        
        messages.forEach(msg => {
            const emojis = msg.content.match(emojiRegex);
            if (emojis) {
                if (!userEmojis[msg.participant]) {
                    userEmojis[msg.participant] = { 
                        count: 0, 
                        unique_emojis: 0,
                        uniqueSet: new Set()
                    };
                }
                
                // Count total emojis
                userEmojis[msg.participant].count += emojis.length;
                
                // Track unique emojis
                emojis.forEach(emoji => {
                    userEmojis[msg.participant].uniqueSet.add(emoji);
                });
            }
        });
        
        // Convert unique sets to counts
        Object.keys(userEmojis).forEach(user => {
            userEmojis[user].unique_emojis = userEmojis[user].uniqueSet.size;
            delete userEmojis[user].uniqueSet; // Remove the set to clean up
        });
        
        return userEmojis;
    }

    computeUserWordClouds(messages) {
        const userWords = {};
        const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'a', 'an', 'is', 'are', 'was', 'were', 'this', 'that', 'it', 'i', 'you', 'he', 'she', 'we', 'they']);
        
        messages.forEach(msg => {
            if (!userWords[msg.participant]) {
                userWords[msg.participant] = {};
            }
            
            const words = msg.content.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
            words.forEach(word => {
                if (!stopWords.has(word)) {
                    userWords[msg.participant][word] = (userWords[msg.participant][word] || 0) + 1;
                }
            });
        });
        
        // Convert to sorted arrays
        const result = {};
        Object.keys(userWords).forEach(user => {
            result[user] = Object.entries(userWords[user])
                .sort(([,a],[,b]) => b-a)
                .slice(0, 15)
                .map(([word, count]) => ({ word, count }));
        });
        
        return result;
    }

    computePauseStats(messages) {
        const pauses = [];
        const conversationThreshold = 4 * 60 * 60 * 1000; // 4 hours
        
        for (let i = 1; i < messages.length; i++) {
            const current = messages[i];
            const previous = messages[i-1];
            const timeDiff = current.timestamp - previous.timestamp;
            
            if (timeDiff > conversationThreshold) {
                pauses.push({
                    duration_hours: Math.round(timeDiff / (1000 * 60 * 60) * 10) / 10,
                    before: previous.timestamp.toISOString(),
                    after: current.timestamp.toISOString(),
                    restarted_by: current.participant
                });
            }
        }
        
        return pauses.sort((a, b) => b.duration_hours - a.duration_hours).slice(0, 5);
    }

    computeHeatmapStats(messages) {
        const heatmapData = {};
        
        // Initialize all days and hours to 0
        for (let day = 0; day < 7; day++) {
            heatmapData[day] = {};
            for (let hour = 0; hour < 24; hour++) {
                heatmapData[day][hour] = 0;
            }
        }
        
        // Count messages by day of week and hour
        messages.forEach(message => {
            const date = new Date(message.timestamp);
            const dayOfWeek = date.getDay(); // 0 = Sunday
            const hour = date.getHours();
            
            heatmapData[dayOfWeek][hour]++;
        });
        
        return heatmapData;
    }

    createUserWordClouds(data) {
        const container = document.getElementById('userWordCloudGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        Object.entries(data).forEach(([userName, words]) => {
            if (!words || !Array.isArray(words)) return;
            
            const userCard = document.createElement('div');
            userCard.className = 'user-stat-card';
            
            const title = document.createElement('h4');
            title.textContent = userName;
            userCard.appendChild(title);
            
            const wordContainer = document.createElement('div');
            wordContainer.className = 'word-cloud-container';
            
            // Take only top 15 words like the original
            words.slice(0, 15).forEach(wordData => {
                const wordElement = document.createElement('span');
                wordElement.className = 'word-item';
                
                // Handle different data structures
                let word, count;
                if (typeof wordData === 'object' && wordData.word) {
                    word = wordData.word;
                    count = wordData.count || wordData.frequency || 1;
                } else if (Array.isArray(wordData) && wordData.length >= 2) {
                    word = wordData[0];
                    count = wordData[1];
                } else if (typeof wordData === 'string') {
                    word = wordData;
                    count = 1;
                } else {
                    return; // Skip invalid data
                }
                
                wordElement.textContent = `${word} (${count})`;
                
                // Dynamic font size based on count like the original
                const fontSize = Math.max(10, Math.min(14, 8 + count / 5));
                wordElement.style.fontSize = `${fontSize}px`;
                
                wordContainer.appendChild(wordElement);
            });
            
            userCard.appendChild(wordContainer);
            container.appendChild(userCard);
        });
    }

    createLongestPausesList(pauses) {
        const container = document.getElementById('longestPauses');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!pauses || pauses.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No significant pauses detected</p>';
            return;
        }
        
        pauses.forEach(pause => {
            const pauseElement = document.createElement('div');
            pauseElement.className = 'pause-item';
            
            pauseElement.innerHTML = `
                <div class="pause-duration">${pause.duration_hours} hours</div>
                <div class="pause-details">
                    From: ${new Date(pause.before).toLocaleString()}<br>
                    To: ${new Date(pause.after).toLocaleString()}<br>
                    Conversation restarted by: <span class="pause-restarter">${pause.restarted_by}</span>
                </div>
            `;
            
            container.appendChild(pauseElement);
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.clientApp = new WhatsAppClientApp();
});
