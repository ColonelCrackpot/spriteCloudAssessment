import { test, expect, APIRequestContext } from '@playwright/test';
import { api_url, endpoints, httpHeaders, payloads } from '../config/api_test.data'

let request: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  //Setup playwright request context
  request = await playwright.request.newContext({
    baseURL: api_url,
    extraHTTPHeaders: httpHeaders
  });
});

test.describe('Positive Scenarios', () => {
  test('1. GIVEN the reqres.in API WHEN a GET request is made to fetch user data THEN the response should be successful and contain user information', async () => {
    //Perform GET request and assert response code
    const response = await request.get(`${endpoints.users}`);
    expect(response.status()).toBe(200);

    //Grab the response body
    const responseBody = await response.json();

    //Assert the response body data
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data.length).toBeGreaterThan(0);

    //Assert that the data has the correct properties and contain string values (not null or empty)
    if (responseBody.data.length > 0) {
      const firstUser = responseBody.data[0];

      //Id
      expect(firstUser).toHaveProperty('id');
      expect(typeof firstUser.id).toBe('number');
      expect(firstUser.id).toBeGreaterThan(0);

      //Email
      expect(firstUser).toHaveProperty('email');
      expect(typeof firstUser.email).toBe('string');
      expect(firstUser.email.length).toBeGreaterThan(0);

      //Frist name
      expect(firstUser).toHaveProperty('first_name');
      expect(typeof firstUser.first_name).toBe('string');
      expect(firstUser.first_name.length).toBeGreaterThan(0);

      //Last name
      expect(firstUser).toHaveProperty('last_name');
      expect(typeof firstUser.last_name).toBe('string');
      expect(firstUser.last_name.length).toBeGreaterThan(0);

      //Avatar
      expect(firstUser).toHaveProperty('avatar');
      expect(typeof firstUser.avatar).toBe('string');
      expect(firstUser.avatar.length).toBeGreaterThan(0);
    }
  });

  test('2. GIVEN valid user credentials WHEN a POST request is made to the login endpoint THEN the login should be successful AND return a token', async () => {
    //Perform POST request and assert response code
    const response = await request.post(`${endpoints.login}`, { data: payloads.validLogin });
    expect(response.status()).toBe(200);

    //Grab the response body and assert the token
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
  });


  test('3. GIVEN user data to update WHEN a PUT request is made to update a specific user THEN the user details should be updated successfully', async () => {
    //Create payload
    const userIdToUpdate = 2;

    //Perform the PUT request and assert response
    const response = await request.put(`${endpoints.users}${userIdToUpdate}`, { data: payloads.updateUser });
    expect(response.status()).toBe(200);

    //Grab the response body and assert the data
    const responseBody = await response.json();
    expect(responseBody.name).toBe(payloads.updateUser.name);
    expect(responseBody.job).toBe(payloads.updateUser.job);
    expect(responseBody).toHaveProperty('updatedAt');
  });

  test('4. GIVEN an existing user ID WHEN a DELETE request is made to remove that user THEN the user should be deleted successfully', async () => {
    //Set userId
    const userIdToDelete = 2;

    //Perform the DELETE request and assert the response
    const response = await request.delete(`${endpoints.users}${userIdToDelete}`);
    expect(response.status()).toBe(204);
    //I would have liked to have added another test here to call the user, but regres.in does not actually delete the user, only returns the code
  });
});

test.describe('Negative Scenarios', () => {
  test('5a. GIVEN login credentials with a missing password WHEN a POST request is made to the login endpoint THEN the login should fail with an error message', async () => {
    //Perform a POST request and assert the response
    const response = await request.post(`${endpoints.login}`, { data: payloads.missingPassword });
    expect(response.status()).toBe(400);

    //Grab the response body and assert the error message is correct
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error', 'Missing password');
  });

  test('5b. GIVEN a non-existent user ID WHEN a GET request is made to fetch that user THEN the API should return a not found error', async () => {
    //Set a non-existent userID
    const nonExistentUserId = 23000;

    //Perform a GET request and assert the response
    const response = await request.get(`${endpoints.users}${nonExistentUserId}`);
    expect(response.status()).toBe(404);
  });
});

test.describe('Delayed Scenarios', () => {
  const delayScenarios = [
    { delaySeconds: 1, description: '1 second delay' },
    { delaySeconds: 2, description: '2 second delay' },
    { delaySeconds: 3, description: '3 second delay' },
  ];
  for (const scenario of delayScenarios) {
    test(`6. GIVEN a request for user data with a ${scenario.description} WHEN the API processes the request THEN the response should be received after the specified delay and be successful`, async () => {
      //Grab the start time of the test
      const startTime = Date.now();

      //Perform a GET request and log the time in milliseconds
      const response = await request.get(`${endpoints.users}?delay=${scenario.delaySeconds}`);
      const endTime = Date.now();
      const durationMs = endTime - startTime;

      //Assert the response
      expect(response.status()).toBe(200);

      //Grab the expected durations
      const expectedMinDurationMs = scenario.delaySeconds * 1000;
      //Add a minor buffer to account for minor delays
      const expectedMaxDurationMs = expectedMinDurationMs + 500;

      //Assert the durations
      expect(durationMs).toBeGreaterThanOrEqual(expectedMinDurationMs);
      expect(durationMs).toBeLessThanOrEqual(expectedMaxDurationMs);
    });
  }
});