import { expect } from "chai";
import app from "../src/app.js";
import request from "supertest";

describe("Venues API", function () {
  this.timeout(5000);
  let token: string;
  let venue_id: string;
  before(async function () {
    const user = {
      email: "tepelakerenke@gmail.com",
      password: "icecream14@",
    };
    const login_response = await request(app)
      .post("/api/v1/users/sign_in")
      .send(user);
    token = login_response.body.data.token;
  });

  it("should create a new venue", async function () {
    const venue = {
      name: "Test Venue",
      image: "https://img.jpg",
      capacity: 100,
      location: "Test Location",
      contact: "test@email.com",
    };
    const response = await request(app)
      .post("/api/v1/venues")
      .set("Authorization", `Bearer ${token}`)
      .send(venue);
    expect(response.status).to.equal(201);
    expect(response.body.success).to.be.true;
    venue_id = response.body.data._id;
  });
  it("should add a section to a venue", async function () {
    const section = {
      venue_id: venue_id,
      name: "Test Section",
      seats: [
        {
          raw: 1,
          x_axis: 10,
          y_axis: 5,
          number: 1,
          price: 100,
        },
        {
          raw: 2,
          x_axis: 20,
          y_axis: 10,
          number: 2,
          price: 110,
        },
        {
          raw: 3,
          x_axis: 30,
          y_axis: 15,
          number: 3,
          price: 120,
        },
        {
          raw: 4,
          x_axis: 40,
          y_axis: 20,
          number: 4,
          price: 130,
        },
        {
          raw: 5,
          x_axis: 50,
          y_axis: 25,
          number: 5,
          price: 140,
        },
        {
          raw: 6,
          x_axis: 60,
          y_axis: 30,
          number: 6,
          price: 150,
        },
        {
          raw: 7,
          x_axis: 70,
          y_axis: 35,
          number: 7,
          price: 160,
        },
        {
          raw: 8,
          x_axis: 80,
          y_axis: 40,
          number: 8,
          price: 170,
        },
        {
          raw: 9,
          x_axis: 90,
          y_axis: 45,
          number: 9,
          price: 180,
        },
        {
          raw: 10,
          x_axis: 100,
          y_axis: 50,
          number: 10,
          price: 190,
        },
        {
          raw: 11,
          x_axis: 110,
          y_axis: 55,
          number: 11,
          price: 200,
        },
        {
          raw: 12,
          x_axis: 120,
          y_axis: 60,
          number: 12,
          price: 210,
        },
        {
          raw: 13,
          x_axis: 130,
          y_axis: 65,
          number: 13,
          price: 220,
        },
        {
          raw: 14,
          x_axis: 140,
          y_axis: 70,
          number: 14,
          price: 230,
        },
        {
          raw: 15,
          x_axis: 150,
          y_axis: 75,
          number: 15,
          price: 240,
        },
        {
          raw: 16,
          x_axis: 160,
          y_axis: 80,
          number: 16,
          price: 250,
        },
        {
          raw: 17,
          x_axis: 170,
          y_axis: 85,
          number: 17,
          price: 260,
        },
        {
          raw: 18,
          x_axis: 180,
          y_axis: 90,
          number: 18,
          price: 270,
        },
        {
          raw: 19,
          x_axis: 190,
          y_axis: 95,
          number: 19,
          price: 280,
        },
        {
          raw: 20,
          x_axis: 200,
          y_axis: 100,
          number: 20,
          price: 290,
        },
        {
          raw: 21,
          x_axis: 210,
          y_axis: 105,
          number: 21,
          price: 300,
        },
        {
          raw: 22,
          x_axis: 220,
          y_axis: 110,
          number: 22,
          price: 310,
        },
        {
          raw: 23,
          x_axis: 230,
          y_axis: 115,
          number: 23,
          price: 320,
        },
        {
          raw: 24,
          x_axis: 240,
          y_axis: 120,
          number: 24,
          price: 330,
        },
        {
          raw: 25,
          x_axis: 250,
          y_axis: 125,
          number: 25,
          price: 340,
        },
        {
          raw: 26,
          x_axis: 260,
          y_axis: 130,
          number: 26,
          price: 350,
        },
      ],
    };

    const response = await request(app)
      .post(`/api/v1/venues/section`)
      .set("Authorization", `Bearer ${token}`)
      .send(section);
    expect(response.status).to.equal(201);
    expect(response.body.success).to.be.true;
  });
  it("should return a list of venues", async function () {
    const response = await request(app)
      .get("/api/v1/venues")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });
  it("should return a single venue", async function () {
    const response = await request(app)
      .get(`/api/v1/venues/${venue_id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });
});
