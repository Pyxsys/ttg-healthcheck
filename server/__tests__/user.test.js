const request = require("supertest");
const connectDB = require("../db/db_connection");
const User = require("../models/user.js");
const app = require("../app");

beforeAll(async () => {
  await connectDB(); // connect to local_db
  await User.deleteMany();
});

const userOne = {
  name: "test",
  email: "test@gmail.com",
};

describe("Create a new user", () => {
  it("should create a new user in the local database", async () => {
    const response = await request(app).post("/api/user").send({
      name: userOne.name,
      email: userOne.email,
    });
    console.log(response.body);
  });
});
