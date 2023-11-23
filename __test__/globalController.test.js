const request = require('supertest');
const express = require('express');
const app = express();

const globalController = require('../Controller/globalController');

app.use(express.json());
app.use('/api', globalController);

describe('Global Controller Tests', () => {
    it('should login a user and return a token', async () => {
        const userData = {
            email: 'test@gmail.com',
            password: 'test',
        };

        // Suppose you have a mock implementation for usersRepository.retrieveUserByEmail
        jest.mock('../Repository/usersRepository', () => ({
            retrieveUserByEmail: jest.fn().mockResolvedValue([{ id: 1, email: 'test@example.com', password: 'hashedpassword' }]),
        }));

        // Suppose you have a mock implementation for functions.verifyPassword
        jest.mock('../Functions', () => ({
            verifyPassword: jest.fn().mockResolvedValue(true),
        }));

        const response = await request(app)
            .post('/api/login')
            .send(userData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
