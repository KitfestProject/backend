import request from "supertest";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import app from "../src/app.js";
import { IUsers } from "../interfaces/index.js";

describe("User API", () => {
  let token: string;
  let user: IUsers;
  beforeEach(() => {
    user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      preferences: {
        musical: ["urban tone"],
        play: ["Comedy", "Tragedy"],
        dance: ["Miondoko", "bale"],
      },
      password: faker.internet.password(),
    } as IUsers;
  });

  before(async () => {
    const loginResponse = await request(app)
      .post("/api/v1/users/sign_in")
      .send(user);
    token = loginResponse.body.token;
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
});
