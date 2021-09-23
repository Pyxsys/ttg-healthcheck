const express = require("express");
const app = express();
const connectDB = require("./db/db_connection");

// setup middlewares
app.use(express.json());

// connect database
connectDB();

// Define Routes
app.use("/api/user", require("./api/user"));

// start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server started"));
