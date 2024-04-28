const http = require("http");
const qs = require("querystring");
const formidable = require("formidable");
const TelegramBot = require("node-telegram-bot-api");

// Replace 'YOUR_BOT_TOKEN' with your actual bot token obtained from BotFather
const bot = new TelegramBot("6901768703:AAFVfxlL81H5t7fQLlQ_lDfD0A7jwNNeD24", {
  polling: true,
});

const chatId = 392576703;

// Function to send a message to Telegram
function sendMessageToTelegram(message) {
  bot
    .sendMessage(chatId, message)
    .then(() => console.log("Message sent to Telegram successfully"))
    .catch((error) =>
      console.error("Error sending message to Telegram:", error)
    );
}

function removeTabsAndNewlines(inputString) {
  // Remove tabulations and newline characters using regular expressions
  const cleanedString = inputString.replace(/\t/g, "").replace(/\n/g, "");
  return cleanedString;
}

function transformToObject(array) {
  const obj = {};
  array.forEach((item) => {
    const key = Object.keys(item)[0];
    const value = Object.values(item)[0];
    obj[key] = value;
  });
  return obj;
}

// Listen for incoming messages
// bot.on("message", (msg) => {
//   // Log the entire message object to find the chat ID
//   console.log("Received message:", msg);

//   // Extract the chat ID from the message object
//   const chatId = msg.chat.id;

//   // Now you can use the chat ID to send messages to this chat
//   // For example:
//   sendMessageToTelegram("Your chat ID is: " + chatId);
// });

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/submit") {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      console.log("Form data received and stored on the server:");
      console.log(fields); // Print the form fields in console as JSON
      let result = transformToObject(
        Object.keys(fields).map((el) => {
          return { [el]: removeTabsAndNewlines(fields[el][0]) };
        })
      );

      console.log("RES", result);
      if (result.email || result.tel) {
        let template = `

      Имя : ${result.name}
      Фамилия : ${result.lastName}
      Емейл : ${result.email}
      Tел : ${result.tel}
      Причина : ${result.reason}
      Доп сообщение : ${result.additionalMessage}
      `;

        sendMessageToTelegram(template);
      }

      // Optionally, you can process the form data here

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Form data received and stored on the server. Thank you!");
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
