/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const { app } = require('../index');
const knex = require('../knex');

chai.use(chaiHttp);

describe('sanity test', () => {
  it('should assert true to be true', () => {
    expect(true).to.be.true;
  });
  it('2 + 2 should equal 4', () => {
    expect(2 + 2).to.equal(4);
  });
});

describe('error handler', () => {

  it('should respond with 404 when given a bad path', async () => {
    const response = await chai.request(app).get('/garbage');
    expect(response).to.have.status(404);
  });
});
