'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { Users } = require('../userModel');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

function generateUser(password) {
    const sampleUser = {
        username : genearteString() ,
        userFullName : genearteString() ,
        userEmail : genearteString() ,
        userPhoneNumber : genearteString() ,
        userEntryIds : [genearteString(), genearteString(), genearteString(), genearteString()] ,
        userDescription : genearteString() ,
        userPassword : password
    }
    return sampleUser;
}

function genearteString() {
    const strings = ["aaaaaa", "bbbbb", "cccccc", "dddddd", "eeeeee"];
    return strings[Math.floor(Math.random() * strings.length)];
}

describe('Auth endpoints', function () {
  const password = "hellohello";
  let username;

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  }); 

  beforeEach(function () {
    return Users.hashPassword(password).then(password =>
      Users.create(generateUser(password))
    );
  });

  afterEach(function () {
    return Users.remove({});
  });

  describe('/auth/login', function () {
    it('Auth Login: Should reject requests with no credentials', function () {
      return chai.request(app)
        .post('/auth/login')
        .send()
        .then((res) => {
          expect(res).to.have.status(400);
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
      });
    });
    it('Auth Login: Should reject requests with incorrect usernames', function () {
      return  Users
      .findOne()
      .then(function(user) {
        username = user.username;
      return chai.request(app)
        .post('/auth/login')
        .send({ username: 'wrongUsername', password: password })
        .then((res) =>
          expect(res).to.have.status(401)
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
      });
    });
    it('Auth Login: Should reject requests with incorrect passwords', function () {
      return Users
      .findOne()
      .then(function(user) {
        username = user.username;
        return chai.request(app)
        .post('/auth/login')
        .send({ username : username, password: 'wrongPassword' })
        .then((res) =>
          expect(res).to.have.status(401)
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
      });
    });
    it('Auth Login: Should return a valid auth token', function () {
      return Users
      .findOne()
      .then(function(user) {
        username = user.username;
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username : username, password : password})
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).to.have.keys(`userId`,`username`,`userFullName`,`userEmail`,`userPhoneNumber`,`userDescription`);
        });
      });
    });
  });

  describe('/auth/refresh', function () {
    it('Auth Refresh: Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .post('/auth/refresh')
        .then((res) =>
          expect(res).to.have.status(401)
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
    });
    it('Auth Refresh: Should reject requests with an invalid token', function () {
      
      return Users.findOne()
      .then(function(user) {
        const token = jwt.sign(
          {
            user : {
              userId : user.userId,
              username : user.username,
              userFullName : user.userFullName,
              userEmail : user.userEmail,
              userPhoneNumber : user.userPhoneNumber,
              userDescription : user.userDescription
            }
          },
          'wrongSecret',
          {
            algorithm: 'HS256',
            expiresIn: '7d'
          }
        );
        return chai.request(app)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then((res) =>
          expect(res).to.have.status(401)
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
      });
    });
    /*
    it('Auth Refresh: Should reject requests with an expired token', function () {
      return Users.findOne()
      .then(function(user) {
        console.log(Math.floor(Date.now() / 1000) - 60);
        const token = jwt.sign(
          {
            user : {
              userId : user.userId,
              username : user.username,
              userFullName : user.userFullName,
              userEmail : user.userEmail,
              userPhoneNumber : user.userPhoneNumber,
              userDescription : user.userDescription
            }
          },
          JWT_SECRET,
          {
            algorithm: 'HS256',
            expiresIn: Math.floor(Date.now() / 1000) - 60 // Expired one minute ago
          }
        );
        
      return chai.request(app)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then((res) =>
          expect(res).to.have.status(401)
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }        
        });
      });
    });
    */
    it('Auth Refresh: Should return a valid auth token with a newer expiry date', function () {
      return Users.findOne()
      .then(function(user) {
        const token = jwt.sign(
          {
            user : {
              userId : user.userId,
              username : user.username,
              userFullName : user.userFullName,
              userEmail : user.userEmail,
              userPhoneNumber : user.userPhoneNumber,
              userDescription : user.userDescription
            }
          },
          JWT_SECRET,
          {
            algorithm: 'HS256',
            expiresIn: `7d`
          }
        );
        const decoded = jwt.decode(token);

        return chai.request(app)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).to.have.keys(`username`,`userFullName`,`userEmail`,`userPhoneNumber`,`userDescription`);
          expect(payload.exp).to.be.at.least(decoded.exp);
        });
      });
    });
  });
});
