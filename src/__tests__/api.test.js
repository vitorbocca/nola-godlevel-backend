import request from 'supertest';
import app from '../server.js';

describe('API Health Check', () => {
  test('GET /health should return 200', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe('OK');
    expect(response.body.environment).toBe('test');
  });
});

describe('API Root', () => {
  test('GET / should return API info', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('NOLA GodLevel Backend API');
    expect(response.body.endpoints).toBeDefined();
  });
});

describe('Dashboard Routes', () => {
  test('GET /api/dashboard/metrics should return 200', async () => {
    const response = await request(app)
      .get('/api/dashboard/metrics')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });
});

describe('404 Handler', () => {
  test('GET /nonexistent should return 404', async () => {
    const response = await request(app)
      .get('/nonexistent')
      .expect(404);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Rota não encontrada');
  });
});

