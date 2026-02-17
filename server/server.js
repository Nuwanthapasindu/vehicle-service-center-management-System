const app = require("./app");
const folderCreate = require("./check/folder");

const port = process.env.PORT || 4000;

app.listen(port, () => {
  folderCreate();
  console.log(`Server is running on port ${port}`);
});
