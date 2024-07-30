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
      name: "The good Place",
      location: "Mars",
      capacity: "10000",
      longitude: "-1.223445",
      latitude: "-3.121211",
      address: "001 Mars",
      image: null,
      amenities: [
        {
          name: "Wifi",
          value: true,
        },
        {
          name: "Parking",
          value: true,
        },
        {
          name: "Catering",
          value: true,
        },
        {
          name: "Projector",
          value: false,
        },
        {
          name: "Whiteboard",
          value: false,
        },
        {
          name: "Microphone",
          value: false,
        },
        {
          name: "Tables",
          value: false,
        },
        {
          name: "Chairs",
          value: false,
        },
        {
          name: "Stage",
          value: false,
        },
        {
          name: "Sound System",
          value: true,
        },
      ],
      seatMap: null,
      seatMapUrl:
        "https://ticketing.kitfest.test.1milliondevs4africa.com/events/nairobi-cinema-seating-plan",
      description: "good place",
    };
    const response = await request(app)
      .post("/api/v1/venues")
      .set("Authorization", `Bearer ${token}`)
      .send(venue);
    expect(response.status).to.equal(201);
    expect(response.body.success).to.be.true;
    venue_id = response.body.data._id;
  });
  it("should return a single venue", async function () {
    const response = await request(app)
      .get(`/api/v1/venues/${venue_id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });
  it("Should remove venue", async function () {
    const response = await request(app)
      .delete(`/api/v1/venues/${venue_id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });
});
