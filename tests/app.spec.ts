import request from "supertest";
import app from "../src/app.js";

it("Should return status 200", (done) => {
  request(app).get("/").expect(200, done);
});
