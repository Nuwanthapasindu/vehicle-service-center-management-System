const app = require("./app");
const folderCreate = require("./check/folder");
const initAutomatedReminders = require("./cron/reminderCron");

const port = process.env.PORT || 4000;

app.listen(port, () => {
  folderCreate();
  // Set isTestMode to false for production (8:00 AM daily)
  // Set isTestMode to true for local testing (runs every minute)
  initAutomatedReminders(false); 
  console.log(`Server is running on port ${port}`);
});
