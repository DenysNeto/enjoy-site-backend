const http = require("http");
const qs = require("querystring");
const formidable = require("formidable");
const TelegramBot = require("node-telegram-bot-api");

// Replace 'YOUR_BOT_TOKEN' with your actual bot token obtained from BotFather

//6901768703:AAFVfxlL81H5t7fQLlQ_lDfD0A7jwNNeD24 - enjoy
//7399661668:AAH512E6YqtisFIRri1jKHky0wHXnOXwcJ8 - NDD webstudio

// UNCOMMENT
const bot = new TelegramBot("6919538601:AAH9FMpcH0ExW8jvIQIDti5TJP0MrfZu-GY", {
  polling: true,
});

const botWebstudio = new TelegramBot(
  "7399661668:AAH512E6YqtisFIRri1jKHky0wHXnOXwcJ8",
  {
    polling: true,
  }
);

const chatId = 392576703;

// Function to send a message to Telegram
function sendMessageToTelegram(bot, message) {
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

//UNCOMMENT
// // Listen for incoming messages
// bot.on("message", (msg) => {
//   console.log("Received message:", msg);
//   const chatId = msg.chat.id;
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

        sendMessageToTelegram(bot, template);
      }

      // Optionally, you can process the form data here

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Form data received and stored on the server. Thank you!");
    });
  } else if (req.method === "POST" && req.url === "/submit_webstudio") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedBody = qs.parse(body);

      // Get the stringified JSON object from the object's key
      const jsonString = Object.keys(parsedBody)[0];

      // Parse the JSON string into an object
      const bodyObject = JSON.parse(jsonString);

      // Access fields inside the parsed body object
      const name = bodyObject.name;
      const email = bodyObject.email;
      const countryCode = bodyObject.countryCode;
      const phone = bodyObject.phone;
      const category = bodyObject.category;
      const comments = bodyObject.comments;

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Received your data successfully!" }));

      let template = `

      Имя : ${bodyObject.name}
      Емейл : ${bodyObject.email}
      Tел : ${bodyObject.countryCode} ${bodyObject.phone}
      Причина : ${bodyObject.category}
      Доп сообщение : ${bodyObject.comments}
      `;

      sendMessageToTelegram(botWebstudio, template);

      // You can then use these values as needed
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Country Code:", countryCode);
      console.log("Phone:", phone);
      console.log("Category:", category);
      console.log("Comments:", comments);
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
