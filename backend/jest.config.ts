import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/seed/**"],
  coverageDirectory: "coverage",
  testTimeout: 30000,
  setupFiles: ["<rootDir>/tests/setup.ts"],
};

export default config;
