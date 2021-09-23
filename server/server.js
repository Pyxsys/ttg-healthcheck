const app = require("./app");

// start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server started"));
