module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // Esto asegura que no intente transformar cosas que no debe
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};