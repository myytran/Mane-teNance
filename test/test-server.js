'use strict';

const chai = require('chai');//assertion library
const chaiHttp = require('chai-http');
const app = require('../server.js');//current folder requires app imported from serjer.js

const expect = chai.expect; //expect Chai assertion library

chai.use(chaiHttp);

describe('index page', function () {
  it('should exist', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  });
});
