require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');

// Inyectamos las APIs globales que faltan en el entorno de Node/JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});

global.alert = jest.fn();