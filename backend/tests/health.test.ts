import request from "supertest";
import { createApp } from "@/app";

describe("Health endpoint", () => {
  const app = createApp();

  it("returns healthy status", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
  });
});

describe("Auth endpoints", () => {
  const app = createApp();

  it("rejects login without credentials", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({});

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });
});
