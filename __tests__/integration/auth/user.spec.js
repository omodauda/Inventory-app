/* 
    @jest-environment node
*/
const server = require('../../../src/app');
const {disconnect} = require('../../server/utils/mongoose');
const User = require('../../../src/models/user');

const supertest = require('supertest');

const app = () => supertest(server);

describe('The register process', () => {

    afterAll(async() => {
        await disconnect();
    });

    beforeEach(async() => {
        await User.deleteMany({});
    });

    const user = {
        email: 'test@user.com',
        password: 'password',
        firstName: 'test',
        lastName: 'test'
    }

    it('should register a new user', async () => {

        const response = await app().post('/api/v1/user/signup').send(user);
        
        const {
            status, 
            message, 
            data: {
                token, 
                confirmationToken, 
                role, 
                email, 
                firstName, 
                lastName
            }
        } = response.body;

        expect(response.status).toBe(201);

        expect(status).toBe('success');

        expect(message).toBe('user created successfully!');

        expect(token).toBeDefined();

        expect(confirmationToken).toBeDefined();

        expect(role).toBe('user');

        expect(email).toBe(user.email);

        expect(firstName).toBe(user.firstName);

        expect(lastName).toBe(user.lastName);
        
    });

    it('should return a 400 if registeration fails', async () => {
        
        await app().post('/api/v1/user/signup').send(user);

        const response = await app().post('/api/v1/user/signup').send(user);

        const {status, error: {message}} = response.body;

        expect(response.status).toBe(406);

        expect(status).toBe('fail');

        expect(message).toBe(`E-mail ${user.email} already in use`);
    });

    describe('Verify user', () => {

        it('should return a 400 for invalid token', async() => {

            const createdUser = await app().post('/api/v1/user/signup').send(user);

            const {
                status, 
                message, 
                data: {
                    confirmationToken,
                    email, 
                }
            } = createdUser.body;

            const body = {
                email: email, 
                confirmToken: 'xxxx'
            }

            const response = await app().post('/api/v1/user/confirm').send(body);

            expect(response.status).toBe(400);

            expect(response.body.status).toBe('fail');

            expect(response.body.error.message).toBe('Invalid token');
            
        });

        it('should verify a user if confirm token is valid', async () => {
            
            const createdUser = await app().post('/api/v1/user/signup').send(user);

            const {
                status, 
                message, 
                data: {
                    confirmationToken,
                    email, 
                }
            } = createdUser.body;

            const body = {
                email: email, 
                confirmToken: JSON.stringify(confirmationToken)
            }

            const response = await app().post('/api/v1/user/confirm').send(body);

            expect(response.status).toBe(200);

            expect(response.body.status).toBe('success');

            expect(response.body.message).toBe('Verification successful');

            const freshUser = await User.findOne({'local.email': email});

            expect(freshUser.status).toBe('Verified');

            expect(freshUser.confirmationToken.token).toBe(null);

            expect(freshUser.confirmationToken.tokenExpiration).toBe(null);
        });

    });

    describe('User login', () => {

        it('should return 400 on invalid details', async () => {

            const createdUser = await app().post('/api/v1/user/signup').send(user);

            const {
                status, 
                message, 
                data: {
                    email, 
                }
            } = createdUser.body;

            const body = {
                email: email, 
                password: 'xxx'
            };

            const response = await app().post('/api/v1/user/login').send(body);

            expect(response.status).toBe(400);

            expect(response.body.status).toBe('fail');

            expect(response.body.error).toBe('Invalid password');
            
        });

        it('should return a token on successful login', async () => {

            const createdUser = await app().post('/api/v1/user/signup').send(user);

            const {
                status, 
                message, 
                data: {
                    email, 
                }
            } = createdUser.body;

            const body = {
                email: email, 
                password: user.password
            };

            const response = await app().post('/api/v1/user/login').send(body);

            expect(response.status).toBe(200);

            expect(response.body.status).toBe('success');

            expect(response.body.data.token).toBeDefined();

            expect(response.body.data.role).toBe('user');

            expect(response.body.data.email).toBe(email);

            expect(response.body.data.status).toBeDefined();

            expect(response.body.data.firstName).toBe(user.firstName);

            expect(response.body.data.lastName).toBe(user.lastName);
            
        });
        
    });
    
});