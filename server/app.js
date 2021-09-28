const express = require("express");
const app = express();
const connectDB = require("./db/db_connection");

// setup middlewares
app.use(express.json());

// connect database
connectDB();

// Define Routes
app.use("/api/user", require("./api/user"));

module.exports = app;
