process.env.NODE_ENV = "test";
process.env.PORT = "5001";
process.env.MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/skillswap-test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-minimum-32-characters";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-minimum-32-characters";
process.env.COOKIE_SECRET = "test-cookie-secret-minimum-32-characters";
process.env.REDIS_ENABLED = "false";
