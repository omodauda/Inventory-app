process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../src/models/user');

//Require test dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const should = chai.should();

chai.use(chaiHttp);

describe('User', () => {

    /* TEST THE SIGNUP ROUTE */
    describe('/signup user', () => {
        it('it should signup a user', (done) => {
            const user = {
                method: 'local',
                local: {
                    email: 'test@yahoo.com',
                    password: 'testing'
                },
                firstName: 'test',
                lastName: 'test'
            }
            chai.request(app)
            .post('/api/v1/user/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('status', 'success'); 
                res.body.data.should.have.property('message', 'user created successfully');
                done();
            })
        })
    })
})