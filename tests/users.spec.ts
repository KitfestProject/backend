import request from "supertest";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import app from "../src/app.js";
import { IUsers } from "../interfaces/index.js";
import { Schema } from "mongoose";

describe("User API", () => {
  let user: IUsers;
  beforeEach(() => {
    user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      preferences: {
        musical: [new Schema.Types.ObjectId("66613d4bb66491550bc6a6e3")],
        play: [new Schema.Types.ObjectId("66613d4bb66491550bc6a6e3")],
        dance: [new Schema.Types.ObjectId("66613d4bb66491550bc6a6e3")],
      },
      password: faker.internet.password(),
    } as IUsers;
  });
  it("should create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users/sign_up")
      .send(user);
    expect(response.status).to.equal(201);
    expect(response.body.success).to.be.true;
  });
  it("should generate a token if the user is created successfully", async () => {
    const response = await request(app)
      .post("/api/v1/users/sign_up")
      .send(user);
    expect(response.status).to.equal(201);
    expect(response.body.data.token).to.be.a("string");
  });
  it("Should Login user given the correct credentials", async () => {
    const response = await request(app)
      .post("/api/v1/users/sign_in")
      .send({ email: user.email, password: user.password });
    if (response.body.success) {
      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.token).to.be.a("string");
    }
    expect(response.status).to.equal(400);
    expect(response.body.success).to.be.false;
    expect(response.body.data).to.be.null;
  });
});
