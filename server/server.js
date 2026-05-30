const http = require("http");
const app = require("./app");
const folderCreate = require("./check/folder");
const initAutomatedReminders = require("./cron/reminderCron");
const socketHelper = require("./socket");

const port = process.env.PORT || 4000;

const server = http.createServer(app);
socketHelper.init(server);

server.listen(port, () => {
  folderCreate();
  // Set isTestMode to false for production (8:00 AM daily)
  // Set isTestMode to true for local testing (runs every minute)
  initAutomatedReminders(false); 
  console.log(`Server is running on port ${port}`);
});
