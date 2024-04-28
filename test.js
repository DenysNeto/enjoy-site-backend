const TelegramBot = require("node-telegram-bot-api");

// Replace 'YOUR_BOT_TOKEN' with your actual bot token obtained from BotFather
const bot = new TelegramBot("6901768703:AAFVfxlL81H5t7fQLlQ_lDfD0A7jwNNeD24", {
  polling: false,
});

// Function to send a message to Telegram
function sendMessageToTelegram(message) {
  bot
    .sendMessage(chatId, message)
    .then(() => console.log("Message sent to Telegram successfully"))
    .catch((error) =>
      console.error("Error sending message to Telegram:", error)
    );
}

// Listen for incoming messages
bot.on("message", (msg) => {
  // Log the entire message object to find the chat ID
  console.log("Received message:", msg);

  // Extract the chat ID from the message object
  const chatId = msg.chat.id;

  // Now you can use the chat ID to send messages to this chat
  // For example:
  sendMessageToTelegram("Your chat ID is: " + chatId);
});
