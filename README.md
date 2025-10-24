# Valorant Compatibility Checker Bot

A Discord bot that helps Valorant players find compatible teammates based on in-game statistics, character preferences, and competitive rank.

## Overview

The **Compatibility Checker** analyzes player data from Valorant match history and uses hierarchical clustering to visualize compatibility between players as a dendrogram. Users can discover other players with similar playstyles and preferences to team up with.

![dendrogram03_modified](https://user-images.githubusercontent.com/61633483/179661776-2b28d0e1-9111-4c2d-9483-1e8148e985b4.png)

## Features

- Fetch player statistics from Valorant API using in-game ID
- Analyze character preferences and playtime across matches
- Perform hierarchical clustering to calculate player compatibility
- Generate visual dendrograms showing player relationships
- Store user data in Firebase for ongoing analysis

## How It Works

1. User invokes `/search` slash command with their Valorant name and tag
2. Bot retrieves match history (50 competitive matches) via unofficial Valorant API
3. Player statistics are stored in Firebase Firestore
4. Hierarchical clustering (Ward method) analyzes compatibility across all registered users
5. Bot generates and returns a dendrogram visualization

## Setup

### Prerequisites

- Node.js 17.x
- Python 3.8 (optional, for future extensions)
- Discord Bot Token
- Firebase Admin SDK credentials

### Installation

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (optional)
pipenv install
```

### Configuration

1. Create a `.env` file in the root directory:
   ```
   TOKEN=your_discord_bot_token_here
   ```

2. Place your Firebase Admin SDK JSON file in the project root:
   ```
   discord-valorant-matching-firebase-adminsdk-*.json
   ```

3. Update Firebase configuration in `index.js` if needed (line 42-48)

### Running the Bot

```bash
# Development (with auto-reload)
npm run dev

# Production
node index.js
```

### Deployment to Heroku

The bot is configured for Heroku deployment via `Procfile`:

```bash
git push heroku master
```

## Usage

In any Discord server where the bot is added:

```
/search name:YourName tag:1234
```

The bot will analyze your stats and show compatibility with other registered users.

## Bot Invite Link

Replace `YOUR_CLIENT_ID` with your Discord application's client ID:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=51200&scope=bot%20applications.commands
```

## Privacy Policy

This bot collects data from your VALORANT account when you use the `/search` command:

### Data Collected
- Match history (up to 50 competitive matches)
- In-game rank and statistics
- Character preferences and playtime
- Discord username

### Data Usage
- Data is stored in Firebase Firestore to enable compatibility analysis
- Other users may see aggregated data in dendrogram visualizations
- Character preferences and rank information are visible to other users
- Personal data will not be shared with third parties

### Contact
For questions or concerns, contact: [contact email]

**Note:** This Privacy Policy is subject to change at any time.

## Terms of Service

By using this bot, you agree to the following terms:

- The bot operator reserves the right to revoke access for any user at any time
- These Terms and Conditions may change without prior notice
- Use of this bot is at your own discretion and risk

## Legal Disclaimer

This bot is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

## Technology Stack

- **Runtime:** Node.js 17.x
- **Discord API:** discord.js v13.6.0
- **Database:** Firebase Firestore
- **Valorant Data:** unofficial-valorant-api
- **Analysis:** ml-hclust (hierarchical clustering)
- **Visualization:** D3.js with server-side rendering

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

ISC
