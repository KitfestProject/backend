import { expect } from "chai";
import app from "../src/app.js";
import request from "supertest";

describe("Venues API", function () {
  this.timeout(5000);
  let token: string;
  let venue_id: string;
  before(async function () {
    const user = {
      email: "hi@kerenketepela.com",
      password: "icecream14@",
    };
    const login_response = await request(app)
      .post("/api/v1/users/sign_in")
      .send(user);
    token = login_response.body.data.token;
  });

  // it("should create a new venue", async function () {
  //   const venue = {
  //     name: "Test Venue",
  //     image: "https://img.jpg",
  //     capacity: 100,
  //     location: "Test Location",
  //     contact: "test@email.com",
  //   };
  //   const response = await request(app)
  //     .post("/api/v1/venues")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send(venue);
  //   expect(response.status).to.equal(201);
  //   expect(response.body.success).to.be.true;
  //   venue_id = response.body.data._id;
  // });
  it("should return a single venue", async function () {
    const response = await request(app)
      .get(`/api/v1/venues/${venue_id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });
});
