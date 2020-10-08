/* 
    @jest-environment node
*/
const User = require('../../../src/models/user');
const { connect, disconnect } = require('../utils/mongoose');
// const passportConf = require('../../../src/passport');
const passport = require('passport');

describe('auth middleware', () => {

    const user = {
        method: 'local',
        local: {
            email: 'passport@test.com',
            password:  'passport',
        },
        firstName: 'test',
        lastName: 'test'
    };

    let createdUser;

    beforeAll(async() => {
        await connect();

        createdUser = await User.create(user);
    });

    afterAll(async() => {
        await disconnect();
    })

    // it('should call the done func for a valid user', async() => {

    //     const done = jest.fn();

    //     await passport.authenticate('local');

    //     expect(done).toHaveBeenCalled();
    // })
    
});