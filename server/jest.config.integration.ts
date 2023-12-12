module.exports = {
    preset: "ts-jest",
    resolver: "jest-ts-webcompat-resolver",
    globalSetup: "./tests/integration/jest.global-setup.ts",
    globalTeardown: "./tests/integration/jest.global-teardown.ts",
    testMatch: ["**/tests/integration/**/*.test.(ts)"],
};
