import { test, expect, APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://reqres.in';

test.describe('ReqRes API Regression Tests', () => {
  let request: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1',
      },
    });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  test('1. Retrieve a list of users', async () => {
    const response = await request.get('/api/users?page=2');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('page', 2);
    expect(responseBody).toHaveProperty('data');
    expect(Array.isArray(responseBody.data)).toBeTruthy();
    expect(responseBody.data.length).toBeGreaterThan(0);

    if (responseBody.data.length > 0) {
      expect(responseBody.data[0]).toHaveProperty('id');
      expect(responseBody.data[0]).toHaveProperty('email');
      expect(responseBody.data[0]).toHaveProperty('first_name');
      expect(responseBody.data[0]).toHaveProperty('last_name');
      expect(responseBody.data[0]).toHaveProperty('avatar');
    }
  });

    test('2. Perform a successful login', async () => {
    const loginPayload = {
      email: 'eve.holt@reqres.in', 
      password: 'cityslicka',
    };
    const response = await request.post('/api/login', { data: loginPayload });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
  });

  test('3. Perform an update on a user', async () => {
    const userIdToUpdate = 2;
    const updatePayload = {
      name: 'morpheus updated',
      job: 'zion resident leader',
    };
    const response = await request.put(`/api/users/${userIdToUpdate}`, { data: updatePayload });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.name).toBe(updatePayload.name);
    expect(responseBody.job).toBe(updatePayload.job);
    expect(responseBody).toHaveProperty('updatedAt');
  });

  test('4. Perform a deletion of a user', async () => {
    const userIdToDelete = 2;
    const response = await request.delete(`/api/users/${userIdToDelete}`);
    expect(response.status()).toBe(204);
  });

  test.describe('Negative Scenarios', () => {
    test('5a. Login with missing password', async () => {
      const loginPayload = {
        email: 'peter@klaven',
      };
      const response = await request.post('/api/login', { data: loginPayload });
      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400); 

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error', 'Missing password');
    });

    test('5b. Get a single user that does not exist', async () => {
      const nonExistentUserId = 23000;
      const response = await request.get(`/api/users/${nonExistentUserId}`);
      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(404);
    });
  });

  const delayScenarios = [
    { delaySeconds: 1, description: '1 second delay' },
    { delaySeconds: 2, description: '2 seconds delay' },
    { delaySeconds: 3, description: '3 seconds delay' },
  ];

  for (const scenario of delayScenarios) {
    test(`6. Delayed request: ${scenario.description}`, async () => {
      const startTime = Date.now();
      const response = await request.get(`/api/users?delay=${scenario.delaySeconds}`);
      const endTime = Date.now();
      const durationMs = endTime - startTime;

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      console.log(`Delay: ${scenario.delaySeconds}s, Actual Duration: ${durationMs}ms`);

      const expectedMinDurationMs = scenario.delaySeconds * 1000;
      const expectedMaxDurationMs = expectedMinDurationMs + 1500;

      expect(durationMs).toBeGreaterThanOrEqual(expectedMinDurationMs);
      expect(durationMs).toBeLessThanOrEqual(expectedMaxDurationMs);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('data');
      expect(Array.isArray(responseBody.data)).toBeTruthy();
    });
  }
});