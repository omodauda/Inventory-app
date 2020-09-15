const mongoose = require('mongoose');

//Require test dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET home route', () => {
    it('it should GET home route', (done) => {
        chai.request(app)
            .get("/")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message', 'welcome to inventory app');
            done();
            })
    })
})