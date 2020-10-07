/* 
    @jest-environment node
*/

const User = require('../../../src/models/user');
const { connect, disconnect} = require('../utils/mongoose');
const Bcrypt = require('bcryptjs');

describe('The User model', () => {

    const user = {
        method: "local",
        local: {
            email: 'test@user.com',
            password: 'password'
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
    });

    

    it('should hash user password before saving', async()=>{

        expect(Bcrypt.compareSync(user.local.password, createdUser.local.password)).toBe(true);

    });

    it('The is valid password method', async() => {
        
        expect(Bcrypt.compareSync(user.local.password, createdUser.local.password)).toBe(true);
    })
});