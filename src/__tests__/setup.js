// Setup para testes Jest
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// Mock do console.log para evitar logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Configurações globais para testes
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'nola_godlevel_test';

