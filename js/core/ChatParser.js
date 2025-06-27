// ChatParser: parse WhatsApp chat export text into message objects
window.ChatParser = {
    parse: function(text) {
        const lines = text.split(/\r?\n/);
        const messages = [];
        const participants = new Set();
        const timestamps = [];
        // Regex: date, time - rest
        const dateRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APMapm]{2})?)\s*-\s*(.+)$/;
        // Only filter out true system messages (not user-generated content like media or deleted messages)
        const systemKeywords = ['encrypted','created group','added','removed','left','changed the group'];
        lines.forEach(line => {
            const m = dateRegex.exec(line);
            if (!m) return;
            const dateStr = m[1];
            const timeStr = m[2];
            let contentPart = m[3];
            // Split participant and message
            const idx = contentPart.indexOf(':');
            if (idx === -1) return;
            const participant = contentPart.slice(0, idx).trim();
            const body = contentPart.slice(idx + 1).trim();
            // Skip only true system messages (not media or deleted messages)
            if (systemKeywords.some(k => body.toLowerCase().includes(k))) return;
            // Parse timestamp
            const parts = dateStr.split('/').map(p => parseInt(p,10));
            let day = parts[0], month = parts[1]-1, year = parts[2];
            if (year < 100) year += 2000;
            // parse time
            let hours=0, minutes=0, seconds=0;
            const t = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*([APMapm]{2}))?/);
            if (t) {
                hours = parseInt(t[1],10);
                minutes = parseInt(t[2],10);
                if (t[3]) seconds = parseInt(t[3],10);
                if (t[4]) {
                    const ampm = t[4].toUpperCase();
                    if (ampm==='PM' && hours<12) hours += 12;
                    if (ampm==='AM' && hours===12) hours = 0;
                }
            }
            const timestamp = new Date(year, month, day, hours, minutes, seconds);
            messages.push({ participant, content: body, timestamp });
            participants.add(participant);
            timestamps.push(timestamp);
        });
        let start = null, end = null;
        if (timestamps.length) {
            start = new Date(Math.min(...timestamps));
            end = new Date(Math.max(...timestamps));
        }
        return { messages, participants: Array.from(participants), dateRangeStart: start, dateRangeEnd: end };
    }
};
