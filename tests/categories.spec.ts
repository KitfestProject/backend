import { ICategories } from "../interfaces/index.js";
import { faker } from "@faker-js/faker";
import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";

describe("Categories API", function () {
  this.timeout(5000);

  let token: string;
  let category: ICategories;
  let category_id: string;

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

  beforeEach(() => {
    category = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    } as ICategories;
  });

  it("should create a new category", async function () {
    this.timeout(5000);
    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${token}`)
      .send(category);
    expect(response.status).to.equal(201);
    expect(response.body.success).to.be.true;
  });

  it("should return a list of categories", async function () {
    this.timeout(5000);
    const response = await request(app)
      .get("/api/v1/categories")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    category_id = response.body.data[0]._id;
  });

  it("should return a single category", async function () {
    this.timeout(5000);
    const response = await request(app)
      .get(`/api/v1/categories/${category_id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  it("should update a category", async function () {
    this.timeout(5000);
    const response = await request(app)
      .patch(`/api/v1/categories/${category_id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(category);
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  it("should delete a category", async function () {
    this.timeout(5000);
    const response = await request(app)
      .delete(`/api/v1/categories/${category_id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });
});
