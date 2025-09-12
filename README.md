# Reddit Trend Analyzer

A modern web application that analyzes Reddit trends and provides insights for growth opportunities. Built with vanilla HTML, CSS, and JavaScript with a Reddit-style UI.

## Features

- 🔍 **Trend Analysis**: Analyze Reddit posts by keywords and subreddit
- 📊 **Growth Insights**: Identify high-engagement posts and trending content
- 🎨 **Authentic Reddit UI**: Pixel-perfect recreation of Reddit's design
- 📱 **Responsive Design**: Works seamlessly on all devices
- ⚡ **Real-time Updates**: Dynamic loading states and animations
- 🌐 **API Integration**: Connects to n8n webhook for data processing

## Live Demo

Visit the live application: [Reddit Trend Analyzer](https://your-username.github.io/Redditor)

## Usage

1. Enter keywords (comma-separated) you want to analyze
2. Specify a subreddit to focus your analysis
3. Click "Analyze" to get Reddit trend insights
4. View results with engagement metrics and growth opportunities

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Custom Properties, Flexbox, Grid
- **API**: n8n webhook integration
- **Deployment**: GitHub Pages

## Local Development

1. Clone the repository
2. Open `index.html` in your browser or use a local server:
   ```bash
   python -m http.server 8000
   ```
3. Navigate to `http://localhost:8000`

## API Configuration

The application connects to an n8n webhook for Reddit data analysis. Update the API URL in `app.js`:

```javascript
const apiUrl = `https://your-n8n-instance.cloud/webhook/reddit-analyze`;
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.
