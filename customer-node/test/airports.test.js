/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../index');

const { expect } = chai;
chai.use(chaiHttp);

describe('airports', () => {
  it('should return an array with status 200', async () => {
    const res = await chai.request(app).get('/airports');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.a('array');
  });
});
