process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const { model: Wallet } = require('../src/models/crypto.model');
const server = require('../src/server');

const should = chai.should();

chai.use(chaiHttp);
// Our parent block
describe('Wallet', () => {
    beforeEach((done) => { // Before each test we empty the database
        Wallet.remove({}, () => {
           done();
        });
    });
/*
  * Test the /GET wallets route
  */
  describe('/GET wallets', () => {
      it('it should GET all the wallets', (done) => {
        chai.request(server)
            .get('/api/wallets')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.data.should.be.a('array');
              done();
            });
      });
  });

  /*
  * Test the /POST wallet
  */
  describe('/POST wallet', () => {
    it('it should POST a wallet', (done) => {
        const newWallet = {
            name: 'Other wallet 2',
            cryptos: [
                {
                    code: 'UST',
                    amount: 2000,
                },
            ],
        };
      chai.request(server)
          .post('/api/wallets')
          .send(newWallet)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.state.should.be.equal('success');
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('cryptos');
                res.body.data.cryptos.should.be.a('array');
            done();
          });
    });
});
});
