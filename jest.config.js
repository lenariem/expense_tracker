module.exports = {
    clearMocks: true,
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['regenerator-runtime/runtime'],
    testPathIgnorePatterns: [
      "/node_modules/",
    ],
  };

  