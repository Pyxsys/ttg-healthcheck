const express = require("express");
const app = express();
const connectDB = require("./db/db_connection");

// setup middleware
app.use(express.json());

// Connect Database
connectDB();
