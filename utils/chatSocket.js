const WebSocket = require('ws');

function startWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      handleMessage(ws, message);
    });
  });

  function handleMessage(ws, message) {
    // Predefined responses based on keywords
    const responses = {
      hello: 'Hello! How can I assist you?',
      bye: 'Goodbye! Have a great day!',
      default: "I'm sorry, I didn't understand that.",
    };

    // Check if the message matches any predefined keywords
    const lowerCaseMessage = message.toLowerCase();
    let response = responses[lowerCaseMessage] || responses.default;

    // Send the response back to the client
    ws.send(`Chatbot: ${response}`);
  }
}

module.exports = startWebSocketServer;
