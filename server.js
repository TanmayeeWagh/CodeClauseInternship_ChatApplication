const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  // Connection opened
  console.log('Client connected');

  ws.on('message', (data) => {
    try {
      const { text } = JSON.parse(data);
      console.log(`Received: ${text}`);

      // Ensure that text is a string
      if (typeof text !== 'string') {
        console.error('Received a non-string message:', text);
        return;
      }

      // Generate a response
      const response = generateResponse(text);
      console.log(`Generated response: ${response}`);

      // Broadcast the user's message to all clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`User: ${text}`);
        }
      });

      // Broadcast the response to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`Bot: ${response}`);
        }
      });
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// ...

function generateResponse(message) {
  // Simple response generation logic
  if (message.toLowerCase().includes('hello')) {
    return 'Hello there!';
  } else if (message.toLowerCase().includes('how are you')) {
    return 'I am a bot, but thanks for asking!';
  } else if (message.toLowerCase().includes('good morning')) {
    return 'Good morning! How can I assist you today?';
  } else if (message.toLowerCase().includes('good afternoon')) {
    return 'Good afternoon! Anything on your mind?';
  } else if (message.toLowerCase().includes('good night')) {
    return 'Good night! Sleep well!';
  } else if (message.toLowerCase().includes('what are you doing?')) {
    return 'I am a bot, just doing my work by responding you!';
  } else if (message.toLowerCase().includes('Tell me a joke')) {
    return 'Did you hear about the claustrophobic astronaut?  He just needed a little space!';
  } else if (message.toLowerCase().includes('Give me the recipe of Tea...')) {
    return '1. Fill up the kettle with water 2. Boil the kettle 3. Place a teabag in your favourite mug 4. Pour boiling water into your avourite mug 5. Brew the tea for a few moments 6. Remove and dispose of the teabag 7. Add milk 8. Add sugar 9. Stir the tea 10. Enjoy the hot beverage';
  } else if (message.toLowerCase().includes('Just want to enjoy some music, do you have any recommendation?')) {
    return 'Ohh Standing next to ypu by Jungkook of BTS is trending currently, you can try that.';
  } else {
    return 'I did not understand that.';
  }
}

// ...


app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

