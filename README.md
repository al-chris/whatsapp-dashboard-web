# WhatsApp Chat Analysis Dashboard

![logo](logo.png)

A **client-side only** web application for analyzing and visualizing WhatsApp chat exports. This version runs entirely in your browser without requiring any server or backend - your data never leaves your device!

## ✨ Features

### 📈 Comprehensive Analytics
- **Message Statistics**: Total messages, participants, date ranges, and daily averages
- **Timeline Analysis**: Message frequency over time with daily, weekly, and monthly views
- **Participant Activity**: Who sends the most messages with interactive charts
- **Message Types**: Analysis of text, media, and system messages

### 🎨 Advanced Visualizations
- **Interactive Charts**: Built with Chart.js for smooth, responsive visualizations
- **Activity Heatmap**: See when conversations are most active throughout the week
- **Word Cloud**: Most frequently used words in horizontal bar chart format
- **Emoji Analysis**: Top emojis used in conversations with usage statistics
- **Response Time Analysis**: How quickly people respond to messages
- **Conversation Starters**: Who initiates conversations most often

### 🔍 Content Analysis
- **Word Frequency**: Filter out common stop words to find meaningful terms
- **Shared Links**: Analyze domains and websites shared in conversations
- **Message Length**: Distribution of short vs long messages
- **User-Specific Analytics**: Individual statistics for each participant

### 🖥️ Modern UI/UX
- **Clean Design**: Modern, responsive interface that works on all devices
- **Drag & Drop**: Easy file upload with visual feedback
- **Interactive Navigation**: Seamless switching between upload and dashboard views
- **Tab-Based Content**: Organized content analysis with easy navigation

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A WhatsApp chat export file (.txt format)

### Installation
1. **Download/Clone** this repository
2. **Open** `index.html` in your web browser
3. That's it! No installation required.

### Using a Local Server (Recommended)
For best performance, serve the files through a local web server:

**Using Python:**
```bash

# Python 3
python -m http.server 8080

# Then open http://localhost:8080 in your browser
```

**Using Node.js:**
```bash
# Install a simple server globally
npm install -g http-server

# Start server
http-server -p 8080

# Open http://localhost:8080 in your browser
```

## 📱 How to Export WhatsApp Chats

### On Android:
1. Open WhatsApp and go to the chat you want to export
2. Tap the three dots (⋮) in the top right
3. Select **More** → **Export chat**
4. Choose **Without media** (recommended for faster processing)
5. Save the .txt file to your device

### On iPhone:
1. Open WhatsApp and go to the chat you want to export
2. Tap the contact/group name at the top
3. Scroll down and tap **Export Chat**
4. Choose **Without Media** (recommended)
5. Save the file or share it to where you can access it

## 💻 Usage

1. **Upload Your Chat**
   - Drag and drop your exported chat file onto the upload zone
   - Or click the upload zone to browse and select your file
   - Supports both .txt and .zip files

2. **View Analytics**
   - Once uploaded, automatically switch to the dashboard
   - Explore different sections: Overview, Timeline, Participants, etc.
   - Use tabs in Content Analysis to switch between Word Cloud, Emojis, and Shared Links

3. **Interactive Features**
   - Hover over charts for detailed information
   - Click legend items to show/hide data series
   - Use time granularity controls for timeline analysis

## 🛠️ Technical Details

### Architecture
- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript
- **Charts**: Chart.js for all visualizations
- **Parsing**: Custom JavaScript chat parser for WhatsApp format
- **Storage**: All data processing happens in browser memory (no data persistence)

### File Structure
```
whatsapp-dashboard-web/
├── index.html         # Main application file
├── README.md          # This file
├── js/
│   ├── app.js         # Main application logic
│   ├── charts.js      # Chart creation and management
│   └── core/
│       └── ChatParser.js  # WhatsApp chat parsing logic
└── styles/
    ├── main.css       # Main stylesheet
    └── components.css # UI component styles
```

### Supported Chat Formats
- **Languages**: English, Spanish, Portuguese, and other major languages
- **Date Formats**: Various international date formats
- **Message Types**: Text, media references, system messages
- **Group Features**: Participant name changes, admin actions

## 🔒 Privacy & Security

- **100% Client-Side**: Your chat data never leaves your browser
- **No Server Required**: No backend, database, or cloud storage
- **No Data Collection**: We don't collect, store, or transmit any of your data
- **Local Processing**: All analysis happens locally on your device

## 🌟 Key Improvements over v1

- **No Backend Required**: Completely client-side application
- **Better Performance**: Faster loading and processing
- **Enhanced UI**: More modern and responsive design
- **New Analytics**: Additional metrics and visualizations
- **Better Mobile Support**: Optimized for mobile devices
- **Improved Parsing**: Better handling of various chat formats

## 🎨 Customization

The application uses CSS custom properties for easy theming. Key colors:
- Primary: `#25d366` (WhatsApp Green)
- Secondary: `#128c7e` (Dark Green)
- Background: `#f5f7fa` (Light Gray)

## 🤝 Contributing

This is part of a larger WhatsApp Dashboard project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues:

**File won't upload:**
- Ensure the file is a valid WhatsApp export (.txt)
- Check that the file isn't corrupted
- Try with a smaller chat export first

**Charts not displaying:**
- Ensure you're using a modern browser
- Check browser console for JavaScript errors
- Try refreshing the page

**Slow performance:**
- Large chat files (>50MB) may take time to process
- Consider exporting chats without media
- Use a desktop browser for better performance

**Date parsing issues:**
- The parser supports most date formats
- If dates aren't recognized, check the chat export format
- Ensure the chat is exported in a supported language

## 📞 Support

If you encounter issues or have questions:
1. Check the troubleshooting section above
2. Look for errors in the browser console (F12)
3. Create an issue in the project repository

---

**Made with ❤️ for WhatsApp chat analysis**

*This tool helps you understand your communication patterns while keeping your data completely private and secure.*

**Created by [@al-chris](https://github.com/al-chris)**  
*Last updated: 2025-06-25*