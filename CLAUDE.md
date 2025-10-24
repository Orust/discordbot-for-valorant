# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Compatibility Checker** - A Discord bot for Valorant that analyzes player compatibility based on match history and in-game statistics. The bot retrieves player data from the Valorant API, performs hierarchical clustering analysis, and visualizes compatibility between users as a dendrogram.

## Tech Stack

- **Primary Runtime**: Node.js 17.x (main application)
- **Secondary Runtime**: Python 3.8 (data analysis, currently not actively used)
- **Deployment**: Heroku (configured via Procfile)
- **Main Dependencies**:
  - `discord.js` v13.6.0 - Discord bot framework
  - `firebase-admin` v10.3.0 - Database for user statistics
  - `unofficial-valorant-api` - Fetching Valorant match data
  - `ml-hclust` - Hierarchical clustering for compatibility analysis
  - `d3` v5.0.0 + `jsdom` - Server-side SVG dendrogram generation
  - `svg-png-converter` - Converting dendrograms to PNG images

## Development Commands

```bash
# Install dependencies
npm install
pipenv install  # Python dependencies (if needed)

# Run bot locally
node index.js

# Run with auto-reload (development)
npm run dev  # Uses nodemon

# Deploy to Heroku
git push heroku master
```

## Architecture

### Core Application Flow (index.js)

1. **Bot Initialization**: Discord client connects using token from `.env`
2. **Slash Command Registration**: `/search` command registered on bot ready
3. **Command Handler**:
   - Receives player name and tag
   - Fetches account data and match history via Valorant API
   - Stores agent preferences and playtime in Firebase Firestore
   - Performs hierarchical clustering (Ward method) on user statistics
   - Generates dendrogram visualization using D3.js
   - Converts SVG to PNG buffer
   - Sends embedded message with dendrogram image

### Data Flow

```
Discord User Input (name#tag)
  ↓
Valorant API (unofficial-valorant-api)
  ↓
Firebase Firestore (user statistics storage)
  ↓
Hierarchical Clustering (ml-hclust with Ward linkage)
  ↓
D3 Dendrogram Generation (server-side with jsdom)
  ↓
SVG → PNG Conversion (svg-png-converter)
  ↓
Discord Embed Response
```

### Key Implementation Details

- **Firebase Initialization**: Hardcoded path `/app/discord-valorant-matching-firebase-adminsdk-*.json` expects Heroku deployment structure
- **D3 Server-Side Rendering**: Uses jsdom to create a virtual DOM for D3 to manipulate (`global.document`)
- **Dendrogram Function**: Custom implementation (`dendrogram()` at line 96) with configurable height cutoff for cluster coloring
- **Python Integration**: PythonShell setup exists but is currently commented out (lines 471-502)
- **Distance Matrix**: Currently uses hardcoded test data (lines 523-534) rather than live computation

## Configuration

### Required Environment Variables (.env)

- `TOKEN` - Discord bot token

### Firebase Setup

- Place Firebase Admin SDK credentials at: `/app/discord-valorant-matching-firebase-adminsdk-9gsja-02db5924bd.json`
- Database URL: `https://discord-valorant-matching-default-rtdb.firebaseio.com`
- Firestore collection: `users` (documents keyed by player ID: `name#tag`)

## Important Considerations

### Security & Privacy

- README.md contains placeholder values for client ID and contact email - replace these with actual values only in local `.env` or secure deployment configs
- Firebase credentials and `.env` files are gitignored
- Privacy Policy (in README.md) describes data collection practices

### Known Issues

- 37 security vulnerabilities detected in dependencies (check GitHub Dependabot)
- Hardcoded distance matrix for testing (lines 523-534)
- Python integration prepared but unused
- Firebase path assumes Heroku `/app/` directory structure

### API Rate Limits

- Valorant API: Fetches 50 competitive matches per request
- Be mindful of Discord API rate limits when sending images

## Repository Structure

- `index.js` - Main bot application (700+ lines, single file)
- `package.json` - Node.js dependencies and scripts
- `Pipfile` - Python dependencies (firebase-admin)
- `requirements.txt` - Full Python environment specification
- `Procfile` - Heroku deployment configuration
- `runtime.txt` - Python runtime version for Heroku
- `.gitignore` - Excludes node_modules, Python packages, credentials, cache files
