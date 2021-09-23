const request = require("supertest");
const connectDB = require("../db/db_connection");

beforeEach(() => {
  connectDB(); // connect to local_db
});

test("this should pass", () => {});
