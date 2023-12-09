# The project wasn't refactored and pushed as a code sample.

### 📙 Short description:
1. Setup your dictionary
2. Setup interval to receive words from dictionary
3. Get messages with the words from dictionary and its sentence examples

### 🤖 Supported Telegram bot commands:
- AddWord = '/addword', // Add expression
- RemoveWord = '/removeword', // Remove expression
- ListWords = '/getwords', // Show expressions list
- RemoveWords = '/removewords', // Remove all words
- AdjustInterval = '/setinterval', // Set sending interval
- MakeAllUnsent = '/makeallunsent',

### 🪛 Technologies:
- Node.js
- Open AI Api
- Telegram Bot Api
- Cloud Mongo DB

### 🗺️ Workflow Schema:
MongoDB => User's Timer Interval =>  Retrieve an unsent word =>  Generate sentence examples for the word => Send the word and sentence examples to the user
