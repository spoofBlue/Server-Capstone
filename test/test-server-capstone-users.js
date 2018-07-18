
`use strict`;

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const mongoose = require(`mongoose`);

const {app, runServer, closeServer} = require(`../server`);
const {Users} = require(`../userModel`);
const {TEST_DATABASE_URL} = require(`../config`);

chai.use(chaiHttp);
const expect = chai.expect;


function seedUserData() {
    console.info('Seeding user data');
    const seedUserData = [];
    for (let i=1; i<=10; i++) {
        seedUserData.push(generateUser());
    }
    return Users.insertMany(seedUserData);
}

function generateUser() {
    const sampleUser = {
        username : genearteString() ,
        userFullName : genearteString() ,
        userEmail : genearteString() ,
        userPhoneNumber : genearteString() ,
        userEntryIds : [genearteString(), genearteString(), genearteString(), genearteString()] ,
        userDescription : genearteString() ,
        userPassword : genearteString()
    }
    return sampleUser;
}

function genearteString() {
    const strings = ["WordsOfInfo", "TextOrName", "StreetOrInfo", "ThingsInAString", "LettersGenerated"];
    return strings[Math.floor(Math.random() * strings.length)];
}

function tearSeedDb() {
    console.warn(`Dropping database`);
    return mongoose.connection.dropDatabase();
}


describe(`User Integration Testing`, function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function() {
        return seedUserData();
    });
    afterEach(function() {
        return tearSeedDb();
    });
    after(function() {
        return closeServer();
    });


    describe(`User GET requests`, function() {
        it('should return all existing users', function() {
            let res;
            return chai.request(app)
                .get('/users')
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an(`array`);
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return Users.countDocuments();
                })
                .then(function(count) {
                    expect(res.body).to.have.lengthOf(count);
                })
        });

        it(`should show a user has all the correct Keys in it`, function() {
            let resUser;
            const userKeys = [`userId`,`username`,`userFullName`,`userEmail`,`userPhoneNumber`,`userEntryIds`,`userDescription`];
            return chai.request(app)
                .get(`/users`)
                .then(function(_res) {
                    resUser = _res.body[0];

                    expect(resUser).to.have.keys(userKeys);
                    return Users.findById(resUser.userId);
                })
                .then(function(chosenUser) {
                    userKeys.forEach(function(key) {
                        if (key !== "userId" && key !== "userEntryIds") {
                            expect(resUser[key]).to.equal(chosenUser[key]);
                        }
                    });
                    expect(chosenUser).to.have.property(`userPassword`);
                });
        });

        it(`should return the user through the GET request specifying a particular id `, function() {
            const userKeys = [`userId`,`username`,`userFullName`,`userEmail`,`userPhoneNumber`,`userEntryIds`,`userDescription`];

            let sampleUser;
            return Users.findOne()
            .then(function(user) {
                sampleUser = user;
                return sampleUser;
            })
            .then(function() {
                return chai.request(app)
                .get(`/users/${sampleUser._id}`)
                .then(function(_res) {
                    const resUser = _res.body;
                    userKeys.forEach(function(key) {
                        if (key !== "userId" && key !== "userEntryIds") {
                            expect(resUser[key]).to.equal(sampleUser[key]);
                        }
                    });
                    return Users.findById(resUser.userId);
                })
                .then(function(chosenUser) {
                    //expect(chosenUser._id).to.equal(sampleUser._id);
                });
            })
        });
    });

    describe(`User POST requests`, function() {

        it(`should post a new user into the database with all required keys (with correct values).`, function() {
            let newUser;
            const userKeys = [`userId`,`username`,`userFullName`,`userEmail`,`userPhoneNumber`,`userEntryIds`,`userDescription`];
            
            let resUser;
            // Promise.resolve.  It looks like good logic. But is it good/neutral practice 
            // even though generateUser() isn't asynchornous, therefore, not necessary?
            Promise.resolve(generateUser())
                .then(newU => {
                    newUser = newU;
                    return chai.request(app)
                .post(`/users`)
                .send(newUser)
                .then(function(_res) {
                    resUser = _res;
                    expect(resUser).to.have.status(201);
                    expect(resUser).to.be.json;
                    expect(resUser.body).to.be.a('object');
                    expect(resUser.body).to.have.keys(userKeys);
                    return Users.find({userId : resUser.body.usersId});
                })
                .then(function(dbUser) {
                    userKeys.forEach(function(key) {
                        /*
                        if (key === "userId") {
                            expect(resUser["userId"]).to.equal(chosenUser["_id"]);
                        } else */
                        if (key !== "userEntryIds" && key !== "userId") {
                            expect(resUser[key]).to.equal(dbUser[key]);
                        }
                    });
                })
                .catch(function(shouldNeverReachHere) {
                    console.log("program should never bring you here.");
                    expect(shouldNeverReachHere).to.be.null;
                });
            })
            .catch(err => {
                console.log(err);
            });
        });

        it(`should not post a request that is missing certain keys in req.body`, function() {
            const badUser = {
                username : "ralph" ,
                userPassword : "gingersnaps"
            }
            
            return chai.request(app)
            .post(`/users`)
            .send(badUser)
            .then(function(_res) {
                expect(_res).to.have.status(400);
            })
            .catch(function(error) {
                expect(error).to.have.status(400);
            });
        });
    });

    describe(`user PUT requests`, function() {
        it(`should make a PUT request and replace the intended information.`, function() {
            let updateInfo = {
                userId : "person" ,
                username : "asdfasdf" ,
                userFullName : "Hill Smith" ,
                userEmail : "newEmail@d.com" ,
                userEntryIds : ["4444", "5555", "6666"] ,
                userDescription : "Hello, I have diner take all my food!"
            };
            // Note updating all the fields except userPassword and userPhoneNumber
            const userKeys = [`userPassword`,`username`,`userFullName`,`userEmail`,`userPhoneNumber`,`userEntryIds`,`userDescription`];

            let chosenUser;
            return Users.findOne()
            .then(function(user) {
                chosenUser = user;
                updateInfo["userId"] = chosenUser._id;
                return chai.request(app)
                .put(`/users/${chosenUser._id}`)
                .send(updateInfo)
                .then(function(_res) {
                    expect(_res).to.have.status(204);
                    return Users.findById(chosenUser._id);
                })
                .then(function(dbUser) {
                    userKeys.forEach(function(key) {
                        if (key === "userEntryIds" && updateInfo["userEntryIds"]) {
                            for (let i=0; i < updateInfo["userEntryIds"]; i++) {
                                expect(dbUser["userEntryIds"][i]).to.equal(updateInfo["userEntryIds"][i]);
                            }
                        } else
                        if (updateInfo[key]) {
                            expect(dbUser[key]).to.equal(updateInfo[key]);
                        }
                    });
                })
                .catch(function(shouldNeverReachHere) {
                    console.log("program should never bring you here.");
                    expect(shouldNeverReachHere).to.be.null;
                });
            });
        });

        it(`should fail to update a user because the id in the user's info is invalid`, function() {
            const badId = "1";
            let updateInfo = {
                username : "asdfasdf" ,
                userFullName : "Hill Smith" ,
                userEmail : "newEmail@d.com" ,
                userEntryIds : ["4444", "5555", "6666"] ,
                userDescription : "Hello, I have diner take all my food!"
            };

            let chosenUser;
            Users.findOne()
            .then(function(user) {
                chosenUser = user;
                updateInfo["userId"] = badId;
                return chai.request(app)
                .put(`/users/${chosenUser._id}`)
                .send(updateInfo)
                .then(function(_res) {
                    expect(_res).to.have.status(400);
                    expect(_res).to.have.property("message");
                })
                .catch(function(error) {
                    expect(error.name).to.equal(`AssertionError`);
                });
            });
        });
    });

    describe(`user DELETE requests`, function() {

        it(`should delete a user of the database`, function() {
            let chosenUser;

            return Users.findOne()
            .then(function(user) {
                chosenUser = user;
                return chai.request(app)
                .delete(`/users/${chosenUser._id}`)
                .then(function(_res) {
                    expect(_res).to.have.status(204);
                    return Users.findById(chosenUser._id);
                })
                .then(function(result) {
                    console.log(`result = ${result}`);
                    expect(result).to.be.null;
                })
                .catch(function(shouldNeverReachHere) {
                    console.log("program should never bring you here.");
                    expect(shouldNeverReachHere).to.be.null;
                });
            });
        });

        it(`should fail to delete a user, as the id given in routing is not valid. Other users still exist.`, function() {
            const badId = "1";
            let chosenUser;

            return Users.findOne()
            .then(function(user) {
                chosenUser = user;
                return chai.request(app)
                .delete(`/users/${badId}`)
                .then(function(_res) {
                    expect(_res).to.have.status(400);
                    return Users.countDocuments();
                })
                .then(function(count) {
                    console.log(`arrived in then`);
                    expect(count).to.equal(10);
                })
                .catch(function(expectedError) {
                    console.log(`arrived in error`);
                    expect(expectedError).to.have.status(400);
                });
            });
        });
    });
});
